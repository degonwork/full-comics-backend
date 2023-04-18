import { Body, Controller, Get, Headers, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Chapter, ChapterDocument } from './schema/chapter.schema';
import { Image } from '../../image/schema/image.schema';
import { PublisherAuthGuard } from 'src/auth/publishers-auth/guards/auth.guard';


@Controller('chapter')
export class ChapterController {
    constructor(
        private readonly chapterService: ChapterService,
    ) { }

    // Tạo chapter mới
    @UseGuards(PublisherAuthGuard)
    @Post('create')
    async createChapter(@Body() createChapterDto: CreateChapterDto, @Req() req: any): Promise<ChapterDocument | string> {
        const reqUser = req.user
        return this.chapterService.createChapter(createChapterDto, reqUser);
    }

    // Lấy chi tiết của chapter
    // @Get('/read-chapter/:id')
    // async getChapterById(@Param('id') id: string): Promise<Chapter> {
    //     return this.chapterService.findChapterById(id);
    // }
    //Đọc chapter
    @Get('/detail-chapter/:id')
    async detailChapters(@Param("id") id: string, @Headers("uuid") uuid: string): Promise<ChapterDocument> {
        return this.chapterService.detailChapter(id, uuid);
    }

    @UseGuards(PublisherAuthGuard)
    @Get('/publisher/:publisherId')
    async findAllChaptersByPublisherId(@Param('publisherId') publisherId: string): Promise<ChapterDocument[]> {
        return await this.chapterService.findAllChaptersByPublisherId(publisherId);
    }


}
