import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kafka, Consumer } from 'kafkajs';
import { Repository } from 'typeorm';
import { KafkaService } from './kafka.service';
import { CardStatusEnum, IssuedCardEntity } from '../../db/typeorm/entities/issued-card.entity';
import { config } from '../../../../../common/constants/constants.config';
import { CloudEvent } from '../../../../../common/interfaces/cloudevent.interface';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private consumer: Consumer;
    private dlqConsumer: Consumer;
    private readonly logger = new Logger(KafkaConsumerService.name);

    constructor(
        @InjectRepository(IssuedCardEntity)
        private readonly issuedCardRepository: Repository<IssuedCardEntity>,
        private readonly kafkaService: KafkaService

    ) {
        this.kafka = new Kafka({
        clientId: 'reto-bcp-consumer',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        });

        this.consumer = this.kafka.consumer({
            groupId: config.KAFKA.GROUPS.GROUP_ISSUED_CARD,
        });

        this.dlqConsumer = this.kafka.consumer({
            groupId: config.KAFKA.GROUPS.GROUP_ISSUED_CARD_DLQ,
        });
    }

    async onModuleInit() {
        await this.startMainConsumer();
        await this.startDLQConsumer();
    }

    async startMainConsumer() {
        await this.consumer.connect();

        await this.consumer.subscribe({
            topic: 'io.card.requested.v1',
            fromBeginning: true,
        });

        this.consumer.run({
            eachMessage: async ({ message }) => {
                const value = message.value?.toString();
                if (!value) return;

                const event = JSON.parse(value);

                console.log('Procesando card:', event);

                await this.processMessage(event);
            },
        });
    }

    async startDLQConsumer() {
        await this.dlqConsumer.connect();
        await this.dlqConsumer.subscribe({
                topic: 'io.card.requested.v1.dlq',
                fromBeginning: true,
            });

        this.dlqConsumer.run({
            eachMessage: async ({ message }) => {
                const value = message.value?.toString();
                if (!value) return;
                const event = JSON.parse(value);
                this.handleDLQEvent(event);
            },
        });
    }

    async onModuleDestroy() {
        await this.consumer.disconnect();
    }

    handleDLQEvent(event: any) {
        const { data } = event;
        this.logger.log('handleDLQEvent.init: ', {data, requestId: event?.source});
    }   

    async processMessage(event: any){
        // console.log('event processMessage: ', event)
        this.logger.log('proccessMesage.init: ', {event, requestId: event?.source});
        
        const MAX_RETRIES = 3;
        let attempt = 0;

        while(attempt < MAX_RETRIES){
            try{
                attempt++;
                console.log('Intento: ', attempt);
                await this.simulateExternalApi(event.forceError, attempt, event?.source);
                await this.handleSucces(event);

                return;
            }catch(err: any){
                console.log(`Error en intento: ${attempt}: `, err)
                this.logger.log('proccessMesage.error: ', {err, requestId: event?.source});
                
                if(attempt >= MAX_RETRIES){
                    await this.handleFail(event, err.message, attempt);
                }
            }
        }
    }

    async simulateExternalApi(forceError: boolean, attempt: number, request_id: string){
        // console.log('forceError: ', forceError)
        this.logger.log('simulateExternalApi.init: ', {forceError, attempt, requestId: request_id});

        const delay = Math.floor(Math.random() * (301)) + 200;

        await new Promise((resolve) => setTimeout(resolve, delay));

        if(forceError && attempt <= 3){
            throw new Error('Error forzado en el intento')
        }
        const isSuccess = Math.random() > 0.5;
        console.log('isSuccess: ', isSuccess)
        this.logger.log('simulateExternalApi.isSuccess: ', {isSuccess, requestId: request_id});

        if(!isSuccess){
            throw new Error('External API falló')
        }
    }

    async handleSucces(event: any){
        try{
            await this.issuedCardRepository.update(
                {id: event.data.cardId},
                {status: CardStatusEnum.ISSUED}
            );

            this.logger.log('IssuedCard actualizada!', {requestId: event?.source});

            console.log('IssuedCard updated!')

            const successEvent: CloudEvent = {
                id: Date.now(),
                source: event.source,
                type: 'io.cards.issued.v1',
                data: {
                    ...event.data,
                    status: CardStatusEnum.ISSUED,
                },
            };

            this.logger.log('handleSuccess.successEvent: ', {successEvent, requestId: event?.source});

            await this.kafkaService.publish(
                config.KAFKA.TOPICS.CARD_ISSUED,
                successEvent,
            );

            this.logger.log('handleSuccess.publish.issuedCard: ', {requestId: event?.source});

            console.log('Card emitida correctamente');
        }catch(err){
            console.log('KafkaConsumerService.handleSuccess.error: ', err)
            throw err;
        }
    }

    async handleFail(event: any, error: any, attempt: number){
        try{
            console.log('handleFail: ', {event, error, attempt})
            this.logger.log('handleFail.init: ', {event, error, attempt,requestId: event?.source});

            await this.issuedCardRepository.update(
                { id: event.data.cardId },
                { status: CardStatusEnum.FAILED }
            );

            this.logger.log('handleFail.update: Se actualizó la issuedCard!', {requestId: event?.source});

            const failEvent: CloudEvent = {
                id: Date.now(),
                source: event.source,
                type: config.KAFKA.TOPICS.CARD_DLQ,
                data: {
                    ...event,
                    status: 'FAILED',
                },
            };

            this.logger.log('handleFail.failEvent: ', {failEvent, requestId: event?.source});

            await this.kafkaService.publish(
                config.KAFKA.TOPICS.CARD_DLQ,
                failEvent,
            );
            this.logger.log('handleFail.publish.dlq: Se publico mensaje a DLQ', {requestId: event?.source});


        }catch(err){
            console.log('KafkaConsumerService.handleFail.error: ', err);
            this.logger.log('handleFail.err: ', {err, requestId: event?.source});
            throw err;
        }
    }
}