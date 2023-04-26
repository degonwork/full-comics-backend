import { Body, Controller, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PublisherAuthGuard } from 'src/auth/publishers-auth/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ResponseComic } from './dto/response_comic.dto';
import { ComicService } from './comic.service';
import { CreateComicDto } from './dto/create-comic.dto';
import { Comic, ComicDocument } from './schema/comic.schema';
import { LimitComic } from './dto/limit-comic.dto';
import { async } from 'rxjs';
import { ResponsePublisherComic } from './dto/response_publisher_comics.dto';

@Controller('comics')
export class ComicController {
    constructor(private readonly comicService: ComicService) { }

    // Tạo comic
    @UseGuards(PublisherAuthGuard)
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

    // Lấy detail comic
    @Get("/:id")
    async findComicById(@Param("id") id: string): Promise<ResponseComic> {
        return this.comicService.findComicById(id);
    }

    // Hot comics
    @Get('home/hot-comics')
    async findHotComic(@Query() query: LimitComic): Promise<Comic[]> {
        return this.comicService.findHotComic(query.limit);
    }

    // New comics
    @Get('home/new-comics')
    async findNewComic(@Query() query: LimitComic): Promise<Comic[]> {
        return this.comicService.findNewComic(query.limit);
    }

    // Publisher's comics
    @UseGuards(PublisherAuthGuard)
    @Get('/publisher/comics')
    async publisherComics(@Req() req: any): Promise<ResponsePublisherComic[]> {
        const publisher_id = req.user.id
        return this.comicService.publisherComics(publisher_id)
    }
}
