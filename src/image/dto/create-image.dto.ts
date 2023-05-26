import { TypeImage } from "../schema/image.schema";

export class CreateImageDto {
    path: string;
    type: TypeImage;
}