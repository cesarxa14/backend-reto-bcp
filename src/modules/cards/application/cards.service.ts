import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IssueCardDto } from "./dtos/issue-card.dto";
import { v4 as uuidv4 } from 'uuid';
import { config } from "../../../common/constants/constants.config";
import { CloudEvent } from "../../../common/interfaces/cloudevent.interface";
import type { CustomerRepository } from "../domain/repositories/customer.repository";
import type { IssuedCardRepository } from "../domain/repositories/issued-card.repository";
import type { ProductRepository } from "../domain/repositories/product.repository";
import type { EventPublisher } from "../domain/repositories/event-publisher.repository";
import { CardStatusEnum } from "../infraestructure/db/typeorm/entities/issued-card.entity";
import { Logger } from '@nestjs/common';


@Injectable()
export class CardsService {

    private readonly logger = new Logger(CardsService.name);
    constructor(
        @Inject('CustomerRepository')
        private readonly customerRepository: CustomerRepository,
        @Inject('ProductRepository')
        private readonly productRepository: ProductRepository,
        @Inject('IssuedCardRepository')
        private readonly issuedCardRepository: IssuedCardRepository,
        @Inject('EventPublisher')
        private readonly eventPublisher: EventPublisher
        // private readonly kafkaService: KafkaService  
    ) {}

    async issueCard(body: IssueCardDto){
        const request_id = uuidv4();
        try{
            
            this.logger.log('issuedCard.init: ', {body, request_id});
            let customer = await this.customerRepository.findByDocument(body.customer.documentNumber);

            // console.log('customer: ', customer)
            this.logger.log('issuedCard.customer: ', {customer, request_id});

            if (!customer) {
                customer = this.customerRepository.create(body.customer);
                await this.customerRepository.save(customer);
            }

            const product = this.productRepository.create(body.product);
            await this.productRepository.save(product);
            
            const existsCustomer = await this.issuedCardRepository.findByDocumentNumber(body.customer.documentNumber);

            this.logger.log('issuedCard.existsCustomer: ', {existsCustomer, request_id});
            
            if(existsCustomer){
                throw new BadRequestException(
                    `Customer already has a card`,
                );
            }
            const issuedCard = await this.issuedCardRepository.create({
                customer: customer,
                product: product,
                requestId: request_id

            });
            const issuedCardSaved = await this.issuedCardRepository.save(issuedCard);

            this.logger.log('issuedCard.issuedCardSaved: ', {issuedCardSaved, request_id});

            const eventPayload: CloudEvent = {
                id: 1, 
                source: request_id,
                type: config.KAFKA.TOPICS.CARD_REQUESTED,
                data: {
                    customer,
                    product,
                    cardId: issuedCard.id,
                },
                forceError: body.forceError
            };

            this.logger.log('issuedCard.eventPayload: ', {eventPayload, request_id});

            await this.eventPublisher.publish(config.KAFKA.TOPICS.CARD_REQUESTED, eventPayload);

            const responseBody = {
                requestID: request_id,
                status: CardStatusEnum.PENDING
            }
            return responseBody;
        }catch(err){
            console.log('CardsService.issueCard.error: ', err);
            this.logger.log('issuedCard.eventPayload: ', {err, request_id});
            throw err;
        }
    }
}
