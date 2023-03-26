import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ImageService } from "../../image/image.service";
import { EntityRepository } from "../../repository/entity.repository";
import { Publisher, PublisherDocument } from "../schema/publisher.schema";

@Injectable()
export class PublisherRepository extends EntityRepository<PublisherDocument>{
    constructor(@InjectModel(Publisher.name) PublisherModel: Model<PublisherDocument>, imageService: ImageService) {
        super(PublisherModel, imageService);
    }
}