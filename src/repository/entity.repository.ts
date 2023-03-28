import { Injectable } from "@nestjs/common";
import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import { CreateChapterContentDto } from "../full-comics/chapter/dto/create-chapter-content.dto";
import { ImageService } from "../image/image.service";

@Injectable()
export abstract class EntityRepository<T extends Document> {
    constructor(
        private readonly entityModel: Model<T>,
        private readonly imageService: ImageService | null,
    ) { }

    async createObject(createObjectDto: any): Promise<T> | null {
        const newObject = Object.assign(createObjectDto);
        const imageObject = createObjectDto.image;
        if (imageObject) {
            const imageId = (await this.imageService.createImage(imageObject))._id;
            newObject.image_id = imageId;
            if (createObjectDto.chapter_content) {
                let createChapterContent = new CreateChapterContentDto();
                createChapterContent.chapterContentId = [];
                for (const imageChapterContent of createObjectDto.chapter_content) {
                    const imageIdChapterContent = (await this.imageService.createImage(imageChapterContent))._id;
                    createChapterContent.chapterContentId.push(imageIdChapterContent);
                }
                newObject.chapter_content = createChapterContent.chapterContentId;
                newObject.publish_date = new Date().toLocaleDateString('en-GB');
            }
        }
        return await this.entityModel.create(newObject);
    }

    async findOneObject(entityFilterQuery: FilterQuery<T>): Promise<T> | null {
        return this.entityModel.findOne(entityFilterQuery).exec();
    }

    async findOneObjectAndUpdate(entityFilterQuery: FilterQuery<T>, updateEntityData: UpdateQuery<any>): Promise<T> | null {
        return this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData).exec();
    }

    async findObject(): Promise<T[]> | null {
        return this.entityModel.find().exec();
    }

}