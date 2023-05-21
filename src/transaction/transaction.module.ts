import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionService } from './Transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
  controllers: [TransactionController],
})
export class TransactionModule {}
