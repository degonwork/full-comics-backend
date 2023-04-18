import { CreateImageDto } from "../../../image/dto/create-image.dto";
import { CreateChapterContentDto } from "./create-chapter-content.dto";

export class CreateChapterDto {
    image: CreateImageDto;
    commic_id: string;
    publisher_id: string;
    chapter_content: CreateChapterContentDto[];

    chapter_intro: string;
    publish_date: string;
    reads: number;


}