import { TypeBook } from "../schema/image.schema";

export class CreateImageDto {
    path: string;
    type: TypeBook;
}