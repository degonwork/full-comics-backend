import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PublisherAuthGuard } from 'src/auth/publishers-auth/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ResponseComic } from './dto/response_comic.dto';
import { ComicService } from './comic.service';
import { CreateComicDto } from './dto/create-comic.dto';
import { Comic, ComicDocument } from './schema/comic.schema';
import { LimitComic } from './dto/limit-comic.dto';

@Controller('comics')
export class ComicController {
    constructor(private readonly comicService: ComicService) { }

    // @UseGuards(PublisherAuthGuard)
    @Post('create')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image_detail', maxCount: 1 },
        { name: 'image_thumnail_square', maxCount: 1 },
        { name: 'image_thumnail_rectangle', maxCount: 1 },
    ]))
    async createComic(
        @Body() createComicDto: CreateComicDto,
        @UploadedFiles() files: { image_detail: Express.Multer.File, image_thumnail_square: Express.Multer.File, image_thumnail_rectangle: Express.Multer.File }
    ): Promise<ComicDocument> {
        return this.comicService.createComic(createComicDto, files.image_detail, files.image_thumnail_square, files.image_thumnail_rectangle);
    }

    @Get("/:id")
    async findComicById(@Param("id") id: string): Promise<ResponseComic> {
        return this.comicService.findComicById(id);
    }

    @Get('home/hot-comic')
    async findHotComic(@Query() query: LimitComic): Promise<Comic[]> {
        return this.comicService.findHotComic(query.limit);
    }

    @Get('home/new-comic')
    async findNewComic(@Query() query: LimitComic): Promise<Comic[]> {
        return this.comicService.findNewComic(query.limit);
    }

}
