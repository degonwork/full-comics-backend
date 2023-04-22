import { Body, Controller, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommicService } from './commic.service';
import { CreateCommicDto } from './dto/create-commic.dto';
import { LimitCommic } from './dto/limit-commic.dto';
import { Commic, CommicDocument } from './schema/commic.schema';
import { PublisherAuthGuard } from 'src/auth/publishers-auth/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ResponseComic } from './dto/response_comic.dto';

@Controller('comics')
export class CommicController {
    constructor(private readonly commicService: CommicService) { }

    @UseGuards(PublisherAuthGuard)
    @Post('create')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'image_thumnail_square', maxCount: 1 },
        { name: 'image_thumnail_rectangle', maxCount: 1 },
    ]))

    async createCommic(
        @Body() createCommicDto: CreateCommicDto,
        @UploadedFiles() files: { image: Express.Multer.File, image_thumnail_square: Express.Multer.File, image_thumnail_rectangle: Express.Multer.File }

    ): Promise<CommicDocument> {
        return this.commicService.createCommic(createCommicDto, files.image, files.image_thumnail_square, files.image_thumnail_rectangle);
    }

    @Get("/:id")
    async findCommicById(@Param("id") id: string): Promise<ResponseComic> {
        return this.commicService.findCommicById(id);
    }

    @Get('hot-comic')
    async findHotCommic(@Query() query: LimitCommic): Promise<Commic[]> {
        return this.commicService.findHotCommic(query.limit);
    }

    @Get('new-comic')
    async findNewCommic(@Query() query: LimitCommic): Promise<Commic[]> {
        return this.commicService.findNewCommic(query.limit);
    }

}
