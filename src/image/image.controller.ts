import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageService } from './image.service';
import { Image } from './schema/image.schema';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Post('create')
    async createImage(@Body() createImageDto: CreateImageDto) : Promise<Image> {
        return await this.imageService.createImage(createImageDto);
    }

    @Get('/:id')
    async getImageById(@Param('id') id : string) : Promise<Image> {
        return await this.imageService.findImageById(id);
    }
}
