import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TransactionService } from './Transaction.service';
import { CreateTransactionDto } from './dto/create-Transaction.dto';

@Controller('Transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
}
