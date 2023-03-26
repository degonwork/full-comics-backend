import { Injectable } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublisherRepository } from './repository/publisher.repository';
import { Publisher } from './schema/publisher.schema';

@Injectable()
export class PublisherService {
    constructor(private readonly publiserRepository: PublisherRepository) {}

    async createPublisher(createPublisherDto: CreatePublisherDto) : Promise<Publisher> {
        return this.publiserRepository.createObject(createPublisherDto);
    }
}
