import { Matches } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';



@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  documentType!: string;

  @Column({unique: true})
  documentNumber!: string;

  @Column()
  fullName!: string;

  @Column()
  age!: number;

  @Column()
  email!: string;
}