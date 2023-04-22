import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { CreateChapterContentDto } from "../dto/create-chapter-content.dto";
import { CreateImageDto } from "src/image/dto/create-image.dto";

export type ChapterDocument = Chapter & Document;

@Schema()
export class Chapter {
    @Prop()
    image_thumnail: CreateImageDto[];
    @Prop()
    commic_id: string;
    @Prop()
    publisher_id: string;
    @Prop()
    chapter_content: CreateChapterContentDto[];
    @Prop()
    chapter_des: string;
    @Prop()
    publish_date: string;
    @Prop()
    reads: number;
    // @Prop({ type: [String], default: [] })
    // user_id: string[];
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);