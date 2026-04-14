import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssuedCardEntity } from './infraestructure/db/typeorm/entities/issued-card.entity';
import { CardsService } from './application/cards.service';
import { CustomerEntity } from './infraestructure/db/typeorm/entities/customer.entity';
import { ProductEntity } from './infraestructure/db/typeorm/entities/product.entity';
import { CustomerRepositoryTypeOrm } from './infraestructure/db/typeorm/customer.repository.impl';
import { ProductRepositoryTypeOrm } from './infraestructure/db/typeorm/product.repository.impl';
import { IssuedCardRepositoryTypeOrm } from './infraestructure/db/typeorm/issued-card.repository.impl';
import { CardsController } from './infraestructure/api/cards.controller';
import { KafkaService } from './infraestructure/events/kafka/kafka.service';

@Module({
  imports: [TypeOrmModule.forFeature([IssuedCardEntity, CustomerEntity, ProductEntity])],
  providers: [
    CardsService, 
    KafkaService,
    {
      provide: 'CustomerRepository',
      useClass: CustomerRepositoryTypeOrm,
    },
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryTypeOrm,
    },
    {
      provide: 'IssuedCardRepository',
      useClass: IssuedCardRepositoryTypeOrm,
    },
    {
      provide: 'EventPublisher',
      useClass: KafkaService,
    }
  ],
  controllers: [CardsController]
})
export class CardsModule {} 
