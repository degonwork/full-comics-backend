import { Injectable } from "@nestjs/common";
import { Model, Document } from "mongoose";
import { ImageService } from "../image/image.service";

@Injectable()
export abstract class EntityRepository<T extends Document> {
    constructor(
        private readonly entityModel: Model<T>,
        private readonly imageService: ImageService,
    ) { }

    async createObject(createObjectDto: any): Promise<T> {
        const image = createObjectDto.image;
        const imageId = (await this.imageService.createImage(image))._id;
        const newObject = Object.assign(createObjectDto);
        newObject.image_id = imageId;
        return await this.entityModel.create(newObject);;
    }

    async findObject(): Promise<T[]> {
        return this.entityModel.find().exec();
    }
}