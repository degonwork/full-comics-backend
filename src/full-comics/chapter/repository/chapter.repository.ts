import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ImageService } from "../../../image/image.service";
import { EntityRepository } from "../../../repository/entity.repository";
import { Chapter, ChapterDocument } from "../schema/chapter.schema";

@Injectable()
export class ChapterRepository extends EntityRepository<ChapterDocument>{
    constructor(@InjectModel(Chapter.name) chapterModel: Model<ChapterDocument>, imageService: ImageService) {
        super(chapterModel, imageService);
    }
}