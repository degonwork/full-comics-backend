import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageRepository } from './repository/image.repository';
import { ImageDocument, Image, } from './schema/image.schema';

@Injectable()
export class ImageService {
    constructor(private readonly imageRepository: ImageRepository) { }

    async createImage(createImageDto: CreateImageDto): Promise<ImageDocument> {
        return this.imageRepository.createObject(createImageDto);
    }

    async createImageFile(createImageDto: CreateImageDto, image: Express.Multer.File): Promise<ImageDocument> {

        createImageDto.path = image.path
        return this.imageRepository.createObject(createImageDto);
    }


    async findImageById(_id: string): Promise<Image> {
        return await this.imageRepository.findOneObject({ _id });

    }
}