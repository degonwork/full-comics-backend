import { CreateImageDto } from "src/image/dto/create-image.dto";

export class CreateCommicDto {
    image: CreateImageDto;
    title: string;
    author: string;
    year: number;
    chapters: [String];
}