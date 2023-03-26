import { CreateImageDto } from "src/image/dto/create-image.dto";

export class CreatePublisherDto{
    name:string;
    image: CreateImageDto;
}