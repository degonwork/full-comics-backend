import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublisherService } from './publisher.service';
import { Publisher } from './schema/publisher.schema';
import { PublicAuthGuard } from 'src/auth/publishers-auth/guards/auth.guard';

@Controller('publisher')
export class PublisherController {
    constructor(private readonly publisherService: PublisherService) { }
    @Post('create')
    async createPublisher(@Body() createPublisherDto: CreatePublisherDto): Promise<Publisher> {
        return this.publisherService.createPublisher(createPublisherDto);
    }

    @UseGuards(PublicAuthGuard)
    @Get('allpublisher')
    async getPublisher(): Promise<Publisher[]> {
        return this.publisherService.getAllPublisher()
    }
}
