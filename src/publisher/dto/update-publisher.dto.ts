import { CreateImageDto } from "src/image/dto/create-image.dto";

export class UpdatePublisherDto {
    name: string;
    publisherName: string;
    password: string;
    images: CreateImageDto;
}