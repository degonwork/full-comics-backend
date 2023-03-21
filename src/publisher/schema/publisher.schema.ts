import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type PublisherDocument = Publisher & Document;


@Schema()
export class Publisher {
    @Prop()
    image_id: string;
    @Prop()
    name: string;
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);