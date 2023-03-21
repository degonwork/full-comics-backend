import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Commic, CommicDocument } from './schema/commic.schema';
import * as mongoose from 'mongoose'
import { CreateCommicDto } from './dto/create-commic.dto';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class CommicService {
    constructor(@InjectModel(Commic.name) private readonly commicModel: mongoose.Model<CommicDocument>, private readonly imageService:ImageService){}

    async createCommic(createCommicDto: CreateCommicDto): Promise<Commic> {
        const image = createCommicDto.image;
        const imageId = (await this.imageService.createImage(image))._id;
        const newCommic = Object.assign(createCommicDto);
        newCommic.image_id = imageId;
        return await this.commicModel.create(newCommic);
    }
}
