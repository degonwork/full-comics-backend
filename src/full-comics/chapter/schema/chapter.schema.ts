import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ChapterDocument = Chapter & Document;

@Schema()
export class Chapter {
    @Prop()
    image_id: string;
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
    @Prop()
    reads: number;
}

export const ChaptersSchema = SchemaFactory.createForClass(Chapter);