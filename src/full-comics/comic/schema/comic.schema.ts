import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UpdateChaptersComic } from '../../chapter/dto/update-chapters-comic.dto';

export type ComicDocument = Comic & Document;

@Schema()
export class Comic {
  @Prop({ required: true })
  image_detail_id: string;
  @Prop({ required: true })
  image_thumnail_square_id: string;
  @Prop({ required: true })
  image_thumnail_rectangle_id: string;
  @Prop({ required: true })
  title: string;
  @Prop({ type: [String] })
  categories: string[];
  @Prop({ default: null })
  author: string;
  @Prop({ default: null })
  description: string;
  @Prop({ default: 0 })
  year: number;
  @Prop()
  chapters: UpdateChaptersComic[];
  @Prop({ default: null })
  update_time: string;
  @Prop({ default: 0 })
  reads: number;
  @Prop({ default: null })
  publisher_id: string;
  @Prop({ default: null })
  chapter_update_time: string;
  @Prop({ default: null })
  add_chapter_time: string;
}

export const ComicSchema = SchemaFactory.createForClass(Comic);
