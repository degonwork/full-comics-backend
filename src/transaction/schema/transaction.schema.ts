import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop()
  user_id: string;
  @Prop()
  uuid: string;
  @Prop({ default: 0 })
  amount: number;
  @Prop()
  deposit_time: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
