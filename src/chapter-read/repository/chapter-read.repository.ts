import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EntityRepository } from "../../repository/entity.repository";
import { ChapterRead, ChapterReadDocument } from "../schema/chapter-read.schema";

@Injectable()
export class ChapterReadRepository extends EntityRepository<ChapterReadDocument>{
    constructor(@InjectModel(ChapterRead.name) private readonly chapterReadModel: Model<ChapterReadDocument>) {
        super(chapterReadModel, null);
    }
}