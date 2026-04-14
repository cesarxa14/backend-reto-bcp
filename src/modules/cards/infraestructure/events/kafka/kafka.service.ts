import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer, Consumer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import { EventPublisher } from "../../../../../domain/repositories/event-publisher.repository";

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy, EventPublisher {
    private kafka: Kafka;
    private producer: Producer;
    private readonly logger = new Logger(KafkaService.name);

    constructor(){
        this.kafka = new Kafka({
            clientId: 'reto-bcp',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
        });
        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        try{
            await this.producer.connect();
            console.log('Kafka Producer conectado')
        }catch(err){
            console.log('KafkaService.onModuleInit.error: ', err);
            throw err;
        }
    }

    async onModuleDestroy() {
        try{
            await this.producer.disconnect();
            console.log('Kafka Producer desconectado');
        }catch(err){
            console.log('KafkaService.onModuleDestroy.error: ', err);
            throw err;
        }
        
    }

    async publish(topic: string, message: any) {
        try {
        await this.producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(message),
                },
            ],
        });

        this.logger.log('KafkaService.publish: Se Envío el mensaje');

        } catch (error) {
            console.error('Kafka.send.error:', error);
            throw error;
        }
    }

}