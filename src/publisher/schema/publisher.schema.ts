import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type PublisherDocument = Publisher & Document;


@Schema()
export class Publisher {
    static find(): Publisher | PromiseLike<Publisher> {
        throw new Error("Method not implemented.");
    }
    @Prop()
    name: string;
    @Prop()
    image_id: string;
    @Prop()
    publisherName: string;
    @Prop()
    password: string;
    @Prop()
    refreshToken: string;
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);