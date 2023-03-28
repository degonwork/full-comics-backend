import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ChapterReadDocument = ChapterRead & Document;

export enum StateChapter {
    READ = 'read',
    READING ='reading',
}

@Schema()
export class ChapterRead {
    @Prop()
    chapter_id: string;
    @Prop()
    user_id: string;
    @Prop()
    commic_id: string;
    @Prop()
    state: StateChapter;
   
}

export const ChapterReadSchema = SchemaFactory.createForClass(ChapterRead);