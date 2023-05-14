import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PublisherAuthGuard } from 'src/auth/publishers-auth/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ResponseComic } from './dto/response-comic.dto';
import { ComicService } from './comic.service';
import { CreateComicDto } from './dto/create-comic.dto';
import { Comic, ComicDocument } from './schema/comic.schema';
import { LimitComic } from './dto/limit-comic.dto';
import { async } from 'rxjs';
import { ResponsePublisherComic } from './dto/response-publisher-comics.dto';
import { UpdateComicDto } from './dto/update-comic.dto';

@Controller('comics')
export class ComicController {
  constructor(private readonly comicService: ComicService) { }

  // Tạo comic
  @UseGuards(PublisherAuthGuard)
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image_detail', maxCount: 1 },
      { name: 'image_thumnail_square', maxCount: 1 },
      { name: 'image_thumnail_rectangle', maxCount: 1 },
    ]),
  )
  async createComic(
    @Body() createComicDto: CreateComicDto,
    @Body('categories', ParseArrayPipe) categories: string[],
    @UploadedFiles()
    files: {
      image_detail: Express.Multer.File;
      image_thumnail_square: Express.Multer.File;
      image_thumnail_rectangle: Express.Multer.File;
    },
  ): Promise<ComicDocument> {
    return this.comicService.createComic(
      { ...createComicDto, categories },
      files.image_detail,
      files.image_thumnail_square,
      files.image_thumnail_rectangle,
    );
  }

  // Create comics test
  @Post('create/test')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image_detail', maxCount: 1 },
      { name: 'image_thumnail_square', maxCount: 1 },
      { name: 'image_thumnail_rectangle', maxCount: 1 },
    ]),
  )
  async createComicTest(
    @Body() createComicDto: CreateComicDto,
    @Body('categories', ParseArrayPipe) categories: string[],
    @UploadedFiles()
    files: {
      image_detail: Express.Multer.File;
      image_thumnail_square: Express.Multer.File;
      image_thumnail_rectangle: Express.Multer.File;
    },
  ): Promise<ComicDocument> {
    return this.comicService.createComic(
      { ...createComicDto, categories },
      files.image_detail,
      files.image_thumnail_square,
      files.image_thumnail_rectangle,
    );
  }

  // Search comics
  @Get('/search')
  async searchComics(@Query('q') query: any): Promise<any> {
    const comics = await this.comicService.searchComics(query);
    return { data: comics };
  }

  // Lấy detail comic
  @Get('/:id')
  async findComicById(@Param('id') id: string): Promise<ResponseComic> {
    return this.comicService.findComicById(id);
  }

  //All comics
  @Get('home/all-comics')
  async findAllComic(@Query() query: LimitComic): Promise<Comic[]> {
    return this.comicService.findAllComics(query.limit);
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
    const publisher_id = req.user.id;
    return this.comicService.publisherComics(publisher_id);
  }

  // Update comic's
  @UseGuards(PublisherAuthGuard)
  @Put('/update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image_detail', maxCount: 1 },
      { name: 'image_thumnail_square', maxCount: 1 },
      { name: 'image_thumnail_rectangle', maxCount: 1 },
    ]),
  )
  async updateComic(
    @Param('id') id: string,
    @Body() comicUpdate: UpdateComicDto,
    @UploadedFiles()
    files: {
      image_detail: Express.Multer.File;
      image_thumnail_square: Express.Multer.File;
      image_thumnail_rectangle: Express.Multer.File;
    },
  ): Promise<ComicDocument> {
    const comicUpdated = await this.comicService.updateComic(
      id,
      comicUpdate,
      files.image_detail,
      files.image_thumnail_square,
      files.image_thumnail_rectangle,
    );
    return comicUpdated;
  }
}
