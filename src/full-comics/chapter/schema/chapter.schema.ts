import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CreateChapterContentDto } from '../dto/create-chapter-content.dto';
import { CreateChapterImageThumnailDto } from '../dto/create-chapter-image-thumnail.dto';

export type ChapterDocument = Chapter & Document;

@Schema()
export class Chapter {
  @Prop({ required: true })
  image_thumnail: CreateChapterImageThumnailDto;
  @Prop({ required: true })
  comic_id: string;
  @Prop()
  publisher_id: string;
  @Prop({ required: true })
  chapter_content: CreateChapterContentDto[];
  @Prop()
  chapter_des: string;
  @Prop()
  publish_date: string;
  @Prop({ default: 0 })
  reads: number;
  // @Prop({ type: [String], default: [] })
  // user_id: string[];
  @Prop({ default: null })
  content_update_time: string;
  @Prop({ default: null })
  update_time: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
