import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeviceDocument = Device & Document;

@Schema()
export class Device {
  @Prop()
  device_id: string;
  @Prop()
  firebase_token: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
