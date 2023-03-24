import { Body, Controller, Post} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';

@Controller('chapter')
export class ChapterController {
    constructor(private readonly chapterService:ChapterService) {}

    @Post('create')
    async createChapter(@Body() createChapterDto: CreateChapterDto) {
        return this.chapterService.createChapter(createChapterDto);
    }
}
