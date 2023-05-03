import { CreateImageDto } from "../../../image/dto/create-image.dto";
import { CreateChapterContentDto } from "./create-chapter-content.dto";

export class CreateChapterDto {
    image_thumnail: CreateImageDto;
    comic_id: string;
    publisher_id: string;
    chapter_content: CreateChapterContentDto[];
    chapter_des: string;
    publish_date: string;
    reads: number;


}