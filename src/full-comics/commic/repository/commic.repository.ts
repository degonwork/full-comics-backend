import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ImageService } from "../../../image/image.service";
import { EntityRepository } from "../../../repository/entity.repository";
import { Commic, CommicDocument } from "../schema/commic.schema";

export class CommicRepository extends EntityRepository<CommicDocument>{
    constructor(@InjectModel(Commic.name) private readonly commicModel: Model<CommicDocument>,  imageService: ImageService) {
        super(commicModel, imageService);
    }
}