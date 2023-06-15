import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  userName: string;
  @Prop()
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  firebase_token: string;
  @Prop()
  subscriptions: string[];
  @Prop()
  image_id: string;
  @Prop()
  refreshToken: string;
  @Prop({ default: 0 })
  amount: number;
  @Prop()
  uuid: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
