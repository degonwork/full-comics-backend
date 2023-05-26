import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { UuidModule } from 'src/uuid/uuid.module';
import { UserModule } from 'src/user/user.module';
import { TransactionService } from './Transaction.service';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    UuidModule,
    UserModule,
  ],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
  controllers: [TransactionController],
})
export class TransactionModule {}
