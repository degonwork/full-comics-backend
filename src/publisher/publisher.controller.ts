import { Body, Controller, Post } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublisherService } from './publisher.service';
import { Publisher } from './schema/publisher.schema';

@Controller('publisher')
export class PublisherController {
    constructor(private readonly publisherService: PublisherService) {}
    @Post('create') 
    async createPublisher(@Body() createPublisherDto : CreatePublisherDto) : Promise<Publisher> {
        return this.publisherService.createPublisher(createPublisherDto);
    }
}
