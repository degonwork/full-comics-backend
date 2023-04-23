import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ImageDocument = Image & Document;

export enum TypeImage {
    COMIC = 'comic',
    CHAPTER = 'chapter',
    CONTENT = 'content',
    PUBLISHER = 'publisher,'
}

@Schema()
export class Image {

    @Prop()
    path: string;

    @Prop()
    type: TypeImage;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
