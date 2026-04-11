import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './modules/cards/cards.module';
import { KafkaModule } from './modules/kafka/kafka.module';

@Module({
  imports: [CardsModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
