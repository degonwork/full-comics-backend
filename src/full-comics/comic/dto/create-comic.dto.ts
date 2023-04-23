import { CreateImageDto } from "../../../image/dto/create-image.dto";

export class CreateComicDto {
    image_detail: CreateImageDto;
    image_thumnail_square: CreateImageDto;
    image_thumnail_rectangle: CreateImageDto;
    title: string;
    description: string;
    author: string;
    year: number;
    chapters: string[];
    reads: number;
    categories: string[];
    publisher_id: string
}