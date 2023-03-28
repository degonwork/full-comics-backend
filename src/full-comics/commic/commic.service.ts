import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Commic, CommicDocument } from './schema/commic.schema';
import { CreateCommicDto } from './dto/create-commic.dto';
import { CommicRepository } from './repository/commic.repository';
import { UpdateCommicDto } from './dto/update-commic.dto';

@Injectable()
export class CommicService {
    constructor(
        private readonly commicRepository: CommicRepository,
        ){}

    async createCommic(createCommicDto: CreateCommicDto): Promise<CommicDocument> {
        createCommicDto.reads = 0;
        return await this.commicRepository.createObject(createCommicDto);
    }

    async findCommicById(_id: string) : Promise<CommicDocument> {
        return this.commicRepository.findOneObject({_id});
    }

    async findCommicByIdAndUpdate(_id:string, updateCommicDto: UpdateCommicDto): Promise<Commic> {
        return this.commicRepository.findOneObjectAndUpdate({_id}, updateCommicDto);
    }

    async findCommic() : Promise<Commic[]> {
        return this.commicRepository.findObject();
    }
}
