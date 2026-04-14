import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductRepositoryTypeOrm implements ProductRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
    ) {}


    async save(data: any): Promise<any> {
        try{
            const productCreated = await this.productRepo.save(data);
            return productCreated;
        }catch(err){
            console.log('ProductRepositoryTypeOrm.save.error: ', err);
            throw err;
        }
    }


    create(data: any){
        try{
            const productCreated = this.productRepo.create(data);
            return productCreated;
        }catch(err){
            console.log('ProductRepositoryTypeOrm.create.error: ', err);
            throw err;
        }
        
    }

}