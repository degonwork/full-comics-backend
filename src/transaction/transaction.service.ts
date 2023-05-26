import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './repository/transaction.repository';
import { CreateTransactionDto } from './dto/create-Transaction.dto';
import { TransactionDocument } from './schema/transaction.schema';
import { UserService } from 'src/user/user.service';
import { UuidService } from 'src/uuid/uuid.service';
import { UserDocument } from 'src/user/schema/user.schema';
import { UuidDocument } from 'src/uuid/schema/Uuid.schema';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userService: UserService,
    private readonly uuidService: UuidService,
  ) {}

  async transaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<string | TransactionDocument> {
    let updateUser: any;
    if (createTransactionDto.user_id) {
      updateUser = await this.changeToken(
        createTransactionDto.user_id,
        createTransactionDto.amount,
        true,
      );
    } else {
      updateUser = await this.changeToken(
        createTransactionDto.uuid,
        createTransactionDto.amount,
        false,
      );
    }
    if (updateUser != false) {
      const transaction = await this.transactionRepository.createObject(
        createTransactionDto,
      );
      console.log(transaction);
      return transaction;
    } else {
      return 'transaction fail';
    }
  }

  async changeToken(id: string, amount: number, isUser: boolean) {
    let user: UserDocument | UuidDocument;

    if (isUser) {
      user = await this.userService.findbyId(id);
    } else {
      user = await this.uuidService.findByUuid(id);
    }
    if (amount >= 0) {
      user.amount += Math.abs(amount);
      await user.save();
      return user;
    } else {
      if (user.amount >= Math.abs(amount)) {
        user.amount -= Math.abs(amount);
        await user.save();
        return user;
      } else {
        return false;
      }
    }
  }
}
