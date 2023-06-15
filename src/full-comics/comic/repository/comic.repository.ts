import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ImageService } from "../../../image/image.service";
import { EntityRepository } from "../../../repository/entity.repository";
import { Comic, ComicDocument } from "../schema/comic.schema";

export class ComicRepository extends EntityRepository<ComicDocument>{
    constructor(@InjectModel(Comic.name) private readonly comicModel: Model<ComicDocument>, imageService: ImageService) {
        super(comicModel, imageService);
    }
}