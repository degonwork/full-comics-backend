import { Body, Controller, Get, Headers, Param, Post, Put, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Chapter, ChapterDocument } from './schema/chapter.schema';
import { PublisherAuthGuard } from 'src/auth/publishers-auth/guards/auth.guard';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateChapterContentDto } from './dto/create-chapter-content.dto';
import { async } from 'rxjs';

@Controller('chapters')
export class ChapterController {
    constructor(
        private readonly chapterService: ChapterService,
    ) { }

    // Tạo chapter mới = upload
    @UseGuards(PublisherAuthGuard)
    @Post('createFile')
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'image_thumnail', maxCount: 1 },
            { name: 'images_content' },
        ]
    ))
    async createChapterFile(
        @Body() createChapterDto: CreateChapterDto,
        @Req() req: any,
        @UploadedFiles() files: { images_content: Express.Multer.File[], image_thumnail: Express.Multer.File }

    ): Promise<ChapterDocument | string> {
        const reqUser = req.user
        return this.chapterService.createChapterFile(createChapterDto, reqUser, files.image_thumnail, files.images_content);
    }

    // Lấy chi tiết của chapter
    @Get('/:id')
    async getChapterById(@Param('id') id: string): Promise<Chapter> {
        return this.chapterService.findChapterById(id);
    }


    //Đọc chapter
    // @Get('/detail-chapter/:id')
    // async detailChapter(@Param("id") id: string, @Headers("uuid") uuid: string): Promise<ChapterDocument> {
    //     return this.chapterService.detailChapter(id, uuid);
    // }

    @UseGuards(PublisherAuthGuard)
    @Get('/publisher/:publisherId')
    async findAllChaptersByPublisherId(@Param('publisherId') publisherId: string): Promise<ChapterDocument[]> {
        return await this.chapterService.findAllChaptersByPublisherId(publisherId);
    }

    // Update thêm ảnh vào chapter content
    @UseGuards(PublisherAuthGuard)
    @UseInterceptors(FilesInterceptor('images_content'))
    @Put('/update/addImageContent/:chapterId')
    async updateAddImageContent(@Param('chapterId') chapterId: string, @UploadedFiles() images_content: Express.Multer.File[]): Promise<ChapterDocument> {
        return await this.chapterService.updateAddImagesContent(chapterId, images_content)
    }

    // Update sắp xếp hoặc xóa image content
    @UseGuards(PublisherAuthGuard)
    @Put('/update/chapterContent/:chapterId')
    async updateChapterContent(
        @Param('chapterId') chapterId: string,
        @Body('chapter_content') chapterContent: CreateChapterContentDto[],
    ): Promise<{ message: string }> {

        return await this.chapterService.updateChapterContent(chapterId, chapterContent)
    }

    // Update chapter des 
    @UseGuards(PublisherAuthGuard)
    @Put('/update/chapterDes/:chapterId')
    async updateChapter(
        @Param('chapterId') chapterId: string,
        @Body('chapter_des') chapterDes: string,
    ): Promise<{ message: string }> {

        return await this.chapterService.updateChapterDes(chapterId, chapterDes)
    }

    // Update chapter thumnail 
    @UseGuards(PublisherAuthGuard)
    @UseInterceptors(FileInterceptor('image_thumnail'))
    @Put('/update/imageThumnail/:chapterId')
    async updateChapterImageThumnail(@Param('chapterId') chapterId: string, @UploadedFile() image_thumnail: Express.Multer.File): Promise<{ message: string }> {
        return await this.chapterService.updateChapterImageThumnail(chapterId, image_thumnail)

    }

}
