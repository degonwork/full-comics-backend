import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../repository/entity.repository';
import { Transaction, TransactionDocument } from '../schema/transaction.schema';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class TransactionRepository extends EntityRepository<TransactionDocument> {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {
    super(transactionModel, null);
  }
}
