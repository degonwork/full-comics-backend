import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UpdateChaptersComic } from "../../chapter/dto/update-chapters-comic.dto";

export type ComicDocument = Comic & Document;

@Schema()
export class Comic {
    @Prop()
    image_detail_id: string;
    @Prop()
    image_thumnail_square_id: string;
    @Prop()
    image_thumnail_rectangle_id: string;
    @Prop()
    title: string;
    @Prop()
    categories: string[];
    @Prop()
    author: string;
    @Prop()
    description: string;
    @Prop()
    year: number;
    @Prop()
    chapters: UpdateChaptersComic[];
    @Prop()
    new_update_time: string;
    @Prop()
    reads: number;
    @Prop({ default: null })
    publisher_id: string;
    @Prop({ default: false })
    forge_delete: boolean
}

export const ComicSchema = SchemaFactory.createForClass(Comic);