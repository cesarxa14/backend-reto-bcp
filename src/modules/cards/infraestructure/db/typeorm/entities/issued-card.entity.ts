import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { ProductEntity } from './product.entity';

export enum CardStatusEnum {
  PENDING = 'PENDING',
  ISSUED = 'ISSUED',
  FAILED = 'FAILED',
}

@Entity('issued_cards')
export class IssuedCardEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CustomerEntity)
  customer!: CustomerEntity;

  @ManyToOne(() => ProductEntity)
  product!: ProductEntity;

  @Column({
    type: 'enum',
    enum: CardStatusEnum,
    default: CardStatusEnum.PENDING,
  })
  status!: CardStatusEnum;

  @Column({
    type: 'varchar'
  })
  requestId!: string;
}