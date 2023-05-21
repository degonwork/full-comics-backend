import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop()
  user_id: string;
  @Prop()
  amount: number;
  @Prop({ default: 0 })
  deposit_time: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
