import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageRepository } from './repository/image.repository';
import { ImageDocument, Image, } from './schema/image.schema';
import { Response } from 'express';

@Injectable()
export class ImageService {
    constructor(private readonly imageRepository: ImageRepository) { }

    async createImage(createImageDto: CreateImageDto): Promise<ImageDocument> {
        return this.imageRepository.createObject(createImageDto);
    }

    async createImageFile(createImageDto: CreateImageDto, image: Express.Multer.File): Promise<ImageDocument> {

        createImageDto.path = `http://localhost:3000/image/${image.filename}`

        const result = await this.imageRepository.createObject(createImageDto)

        return result;

    }


    async createComicImageFile(createImageDto: CreateImageDto, image: Express.Multer.File): Promise<ImageDocument> {
        createImageDto[0].path = `http://localhost:3000/image/${image[0].filename}`
        const result = await this.imageRepository.createObject(createImageDto)
        return result;

    }
    async findImagesById(id: string): Promise<Image[]> {

        return this.imageRepository.findById(id);
    }


    async findImageById(_id: string): Promise<Image> {
        return await this.imageRepository.findOneObject({ _id });


    }

    async getImage(filename: string, res: Response) {

        res.sendFile(filename, { root: './uploads' })

    }
}