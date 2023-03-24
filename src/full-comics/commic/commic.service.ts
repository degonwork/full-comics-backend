import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Commic, CommicDocument } from './schema/commic.schema';
import { CreateCommicDto } from './dto/create-commic.dto';
import { CommicRepository } from './repository/commic.repository';

@Injectable()
export class CommicService {
    constructor(
        private readonly commicRepository: CommicRepository,
        ){}

    async createCommic(createCommicDto: CreateCommicDto): Promise<Commic> {
        return await this.commicRepository.createObject(createCommicDto);
        
    }

    async findCommic() : Promise<Commic[]> {
        return this.commicRepository.findObject();
    }
}
