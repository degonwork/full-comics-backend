import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './repository/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}
}
