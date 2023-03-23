import { CreateImageDto } from "src/image/dto/create-image.dto";

export class CreateChapterDto {
    image: CreateImageDto;
    commic_id: string;
    publisher_id: string;
    chapter_content: [String];
    chapter_intro: string;
    publish_date: string;
}