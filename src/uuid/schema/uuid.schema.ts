import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UuidDocument = Uuid & Document;

@Schema()
export class Uuid {
  @Prop({ required: true })
  uuid: string;
  @Prop()
  firebase_token: string;
  @Prop({ default: 0 })
  amount: number;
}

export const UuidSchema = SchemaFactory.createForClass(Uuid);
