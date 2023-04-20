import { Body, Controller, Get, Headers, Param, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Chapter, ChapterDocument } from './schema/chapter.schema';
import { Image, ImageDocument } from '../../image/schema/image.schema';
import { PublisherAuthGuard } from 'src/auth/publishers-auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { ImageService } from 'src/image/image.service';


@Controller('chapter')
export class ChapterController {
    constructor(
        private readonly chapterService: ChapterService,
        private readonly imageService: ImageService
    ) { }

    // Tạo chapter mới = link
    @UseGuards(PublisherAuthGuard)
    @Post('create')
    async createChapter(@Body() createChapterDto: CreateChapterDto, @Req() req: any): Promise<ChapterDocument | string> {
        const reqUser = req.user
        return this.chapterService.createChapter(createChapterDto, reqUser);
    }

    // Tạo chapter mới = upload
    @UseGuards(PublisherAuthGuard)
    @Post('createFile')
    @UseInterceptors(FileInterceptor('image'))
    async createChapterFile(@Body() createChapterDto: CreateChapterDto, @Req() req: any, @UploadedFile() image: Express.Multer.File): Promise<ChapterDocument | string> {
        const reqUser = req.user
        return this.chapterService.createChapterFile(createChapterDto, reqUser, image);
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

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async createImage(@Body() createImageDto: CreateImageDto, @UploadedFile() image: Express.Multer.File): Promise<any> {
        // return await this.chapterService.createImageFile(createImageDto, File);
        return await this.imageService.createImageFile(createImageDto, image);
    }

}
