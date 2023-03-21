import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageDocument, Image, TypeBook } from './schema/image.schema';

@Injectable()
export class ImageService {
    constructor(@InjectModel(Image.name) private readonly imageModel: mongoose.Model<ImageDocument>) { }

    async createImage(createImageDto: CreateImageDto): Promise<ImageDocument> {
        const newBook = new this.imageModel();
        const { path, type } = createImageDto;
        newBook.path = path;
        newBook.type = type;
        return newBook.save();
    }


    async findImageById(id: string): Promise<Image> {
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) throw new BadRequestException('Please enter correct id');
        const image = this.imageModel.findById(id);
        if (!image) throw new NotFoundException('Image not found');
        return image;
    }
}
