import { CreateImageDto } from "../../../image/dto/create-image.dto";
import { CreateChapterContentDto } from "./create-chapter-content.dto";

export class CreateChapterDto {
    // image_banner: CreateImageDto;
    commic_id: string;
    publisher_id: string;
    chapter_content: CreateChapterContentDto[];
    // image_banner: Express.Multer.File
    chapter_intro: string;
    publish_date: string;
    reads: number;


}