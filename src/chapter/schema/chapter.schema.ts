import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ChaptersDocument = Chapters & Document;

@Schema()
export class Chapters {
    @Prop()
    image_id: [String];
    @Prop()
    commic_id: string;
    @Prop()
    publisher_id: string;
    @Prop()
    chapter_content: [String];
    @Prop()
    chapter_intro: string;
    @Prop()
    publish_date: string;
}

export const ChaptersSchema = SchemaFactory.createForClass(Chapters);