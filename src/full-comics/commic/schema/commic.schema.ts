import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UpdateChaptersCommic } from "src/full-comics/chapter/dto/update-chapters-commic.dto";

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
    chapters: UpdateChaptersCommic[];
    @Prop()
    new_update_time: string;
    @Prop()
    reads: number;
}

export const CommicSchema = SchemaFactory.createForClass(Commic);