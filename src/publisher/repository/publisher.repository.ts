import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ImageService } from "../../image/image.service";
import { EntityRepository } from "../../repository/entity.repository";
import { Publisher, PublisherDocument } from "../schema/publisher.schema";
import { CreatePublisherDto } from "../dto/create-publisher.dto";

@Injectable()
export class PublisherRepository extends EntityRepository<PublisherDocument>{
    constructor(@InjectModel(Publisher.name)
    private readonly publisherModel: Model<PublisherDocument>, imageService: ImageService) {
        super(publisherModel, imageService);
    }
    async createPublisher(createPublisherDto: CreatePublisherDto): Promise<Publisher> {
        const publisher = new this.publisherModel(createPublisherDto);
        return publisher.save();
    }


}