import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageRepository } from './repository/image.repository';
import { ImageDocument, Image } from './schema/image.schema';
import { Response } from 'express';
import sizeOf from 'image-size';
import axios from 'axios';
import { ImageResponse } from './dto/image-response.dto';
@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async createImage(createImageDto: CreateImageDto): Promise<ImageDocument> {
    return this.imageRepository.createObject(createImageDto);
  }

  async createImageFile(
    createImageDto: CreateImageDto,
    image: Express.Multer.File,
  ): Promise<ImageDocument> {
    createImageDto.path = `${process.env.BASEURLIMAGE}${image.filename}`;
    const result = await this.imageRepository.createObject(createImageDto);
    return result;
  }

  async createComicImageFile(
    createImageDto: CreateImageDto,
    image: Express.Multer.File,
  ): Promise<ImageDocument> {
    createImageDto.path = `${process.env.BASEURLIMAGE}${image[0].filename}`;
    const result = await this.imageRepository.createObject(createImageDto);
    return result;
  }

  async findImagesById(id: string): Promise<Image[]> {
    return this.imageRepository.findById(id);
  }

  async findImageById(_id: string): Promise<Image> {
    return await this.imageRepository.findOneObject({ _id });
  }
  async findImageByIdDetailChapter(_id: string): Promise<ImageResponse> {
    const image = await this.imageRepository.findOneObject({ _id });
    const { width, height } = await this.getImageSize(image.path);
    return new ImageResponse(image.id, image.path, width, height);
  }
  
  async getImage(filename: string, res: Response) {
    res.sendFile(filename, { root: './uploads' });
  }

  async getImageSize(
    imageUrl: string,
  ): Promise<{ width: number; height: number }> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const imageData = Buffer.from(response.data, 'binary');
      const dimensions = sizeOf(imageData);
      return { width: dimensions.width, height: dimensions.height };
    } catch (error) {
      console.error(
        'Đã xảy ra lỗi khi lấy kích thước của hình ảnh từ URL:',
        error,
      );
      throw error;
    }
  }
}
