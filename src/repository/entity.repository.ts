import { Injectable } from '@nestjs/common';
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { CreateImageDto } from '../image/dto/create-image.dto';
import { ImageService } from '../image/image.service';

@Injectable()
export abstract class EntityRepository<T extends Document> {
  constructor(
    private readonly entityModel: Model<T>,
    private readonly imageService: ImageService | null,
  ) {}

  async createImage(imageObject: CreateImageDto): Promise<string | null> {
    const imageObjectId = (await this.imageService.createImage(imageObject))
      ._id;
    return imageObjectId;
  }
  async createImageFile(
    imageObject: CreateImageDto,
    image: Express.Multer.File,
  ): Promise<string | null> {
    const imageObjectId = (
      await this.imageService.createImageFile(imageObject, image)
    )._id;

    return await imageObjectId;
  }

  async createObject(newObject: any): Promise<T> | null {
    return await this.entityModel.create(newObject);
  }

  async findOneObject(entityFilterQuery: FilterQuery<T>): Promise<T> | null {
    return this.entityModel.findOne(entityFilterQuery).exec();
  }

  async findOneObjectAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<any>,
  ): Promise<T> | null {
    return this.entityModel
      .findOneAndUpdate(entityFilterQuery, updateEntityData)
      .exec();
  }
  async findOneObjectAndDelete(
    entityFilterQuery: FilterQuery<T>,
  ): Promise<T> | null {
    return this.entityModel.findOneAndDelete(entityFilterQuery).exec();
  }

  async findObject(limit?: number): Promise<T[]> | null {
    return this.entityModel.find().limit(limit).exec();
  }
  async findObjectNoLimit(): Promise<T[]> | null {
    return this.entityModel.find().exec();
  }

  async findObjectsBy(
    fieldName: string,
    fieldValue: any,
    limit?: number,
  ): Promise<T[]> | null {
    const query: any = {};
    query[fieldName] = fieldValue;
    const result = await this.entityModel.find(query).limit(limit).exec();    
    return result;
  }
  async find(entityFilterQuery: FilterQuery<T>): Promise<T[]> {
    return this.entityModel.find(entityFilterQuery).exec();
  }
}
