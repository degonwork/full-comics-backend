import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CommicDocument = Commic & Document;

@Schema()
export class Commic {
    @Prop()
    image_id: string;
    @Prop()
    title: string;
    @Prop()
    author: string;
    @Prop()
    year: number;
    @Prop()
    chapters: [String];
}

export const CommicSchema = SchemaFactory.createForClass(Commic);