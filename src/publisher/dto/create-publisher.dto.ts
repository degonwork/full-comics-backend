import { CreateImageDto } from "src/image/dto/create-image.dto";

export class CreatePublisherDto {
    name: string;
    publisherName: string;
    password: string;
    images: CreateImageDto;
}