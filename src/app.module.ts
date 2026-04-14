import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './modules/cards/cards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { databaseConfig } from './config/database.config';
import { envValidationSchema } from './config/env.validation';
import { KafkaModule } from './modules/cards/infraestructure/events/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema
    }),
    CardsModule, 
    KafkaModule,
    TypeOrmModule.forRoot(databaseConfig())
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


