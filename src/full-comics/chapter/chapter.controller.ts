import { Body, Controller, Get, Headers, Param, Post} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Chapter, ChapterDocument } from './schema/chapter.schema';

@Controller('chapter')
export class ChapterController {
    constructor(
        private readonly chapterService:ChapterService,
        ) {}

    @Post('create')
    async createChapter(@Body() createChapterDto: CreateChapterDto): Promise<ChapterDocument| string> {
        return this.chapterService.createChapter(createChapterDto);
    }

    @Get('/detail-chapter/:id')
    async getChapterById(@Param('id') id: string, @Headers('uuid') uuid: string) : Promise<Chapter> {
        return this.chapterService.findChapterById(id, uuid);
    }

   
}
