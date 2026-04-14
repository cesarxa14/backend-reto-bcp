import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomerRepositoryTypeOrm implements CustomerRepository {
    constructor(
        @InjectRepository(CustomerEntity)
        private readonly customerRepo: Repository<CustomerEntity>,
    ) {}

    create(data: any) {
        try{
            const customerCreated = this.customerRepo.create(data);
            return customerCreated
        }catch(err){
            console.log('CustomerRepositoryTypeOrm.create.error: ', err)
            throw err;
        }
    }

    async save(data: any): Promise<any> {
        try{
            const customerCreated = await this.customerRepo.save(data);
            return customerCreated
        }catch(err){
            console.log('CustomerRepositoryTypeOrm.save.error: ', err)
            throw err;
        }
    }

    async findByDocument(documentNumber: string): Promise<any> {
        try{
            const customerFound = await this.customerRepo.findOne({
                where: { documentNumber: documentNumber }
            });
            return customerFound;
        }catch(err){
            console.log('CustomerRepositoryTypeOrm.findByDocument.error: ', err);
            throw err;
        }
        
    }
}