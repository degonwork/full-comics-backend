import { CreateChapterContentDto } from "./create-chapter-content.dto";
import { CreateChapterImageThumnailDto } from "./create-chapter-image-thumnail.dto";

export class CreateChapterDto {
    image_thumnail: CreateChapterImageThumnailDto;
    comic_id: string;
    publisher_id: string;
    chapter_content: CreateChapterContentDto[];
    chapter_des: string;
    publish_date: string;
    reads: number;


}