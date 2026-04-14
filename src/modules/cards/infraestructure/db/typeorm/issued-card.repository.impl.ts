import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IssuedCardEntity } from './entities/issued-card.entity';
import { IssuedCardRepository } from '../../../domain/repositories/issued-card.repository';

@Injectable()
export class IssuedCardRepositoryTypeOrm implements IssuedCardRepository {
  constructor(
    @InjectRepository(IssuedCardEntity)
    private readonly issueCardRepo: Repository<IssuedCardEntity>,
  ) {}


  async save(data: any): Promise<any> {
    try{
        const issuedCardSaved = await this.issueCardRepo.save(data);
        return issuedCardSaved;
    }catch(err){
      console.log('IssuedCardRepositoryTypeOrm.save.error: ', err)
      throw err;
    }
  }


  create(data: any) {
    const issuedCardCreated = this.issueCardRepo.create(data);
    return issuedCardCreated;
  }


  async findByDocumentNumber(documentNumber: string): Promise<any> {
    try{
      const existsCustomer = await this.issueCardRepo.findOne({
            where: {
                customer: {
                    documentNumber: documentNumber
                }
            },
            relations: ['customer']
      })
      return existsCustomer;
    }catch(err){
      console.log('IssuedCardRepositoryTypeOrm.updateStatus.error: ', err);
      throw err;
    }
  }

  async updateStatus(cardId: number, status: any): Promise<void> {
    try{
      await this.issueCardRepo.update({ id: cardId }, { status });
    }catch(err){
      console.log('IssuedCardRepositoryTypeOrm.updateStatus.error: ', err);
      throw err;
    }
  }
}