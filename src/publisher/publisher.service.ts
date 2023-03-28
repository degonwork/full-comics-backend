import { Injectable } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublisherRepository } from './repository/publisher.repository';
import { Publisher, PublisherDocument } from './schema/publisher.schema';

@Injectable()
export class PublisherService {
    constructor(private readonly publiserRepository: PublisherRepository) {}

    async getDetailPublisher(user: PublisherDocument): Promise<any> {
        return {
            id: user._id,
            userName: user.userName,
            image_id: user.image_id,
        }
    }

    async createPublisher(createPublisherDto: CreatePublisherDto) : Promise<Publisher> {
        return this.publiserRepository.createObject(createPublisherDto);
    }
}
