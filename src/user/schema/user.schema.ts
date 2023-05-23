import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  device_id: string;
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
}

export const UserSchema = SchemaFactory.createForClass(User);
