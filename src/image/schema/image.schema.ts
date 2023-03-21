import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ImageDocument = Image & Document;

export enum TypeBook  {
    COMMIC = 'commic',
    CHAPTER = 'chapter',
    CONTENT = 'content'
}

@Schema()
export class Image {
    @Prop()
    path: string;
    @Prop()
    type: TypeBook;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
