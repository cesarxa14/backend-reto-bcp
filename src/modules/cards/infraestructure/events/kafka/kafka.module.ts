import { Module, Global } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaConsumerService } from './kafka.consumer.kafka';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssuedCardEntity } from '../../entities/issued-card.entity';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([IssuedCardEntity])],
    providers: [KafkaService, KafkaConsumerService],
    exports: [KafkaService],
})
export class KafkaModule {}