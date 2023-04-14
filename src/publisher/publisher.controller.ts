import { Body, Controller, Get, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { Publisher, PublisherDocument } from './schema/publisher.schema';
import { PublisherAuthGuard } from 'src/auth/publishers-auth/guards/auth.guard';
import { Param } from '@nestjs/common/decorators';
import { UpdatePublisherDto } from './dto/update-publisher.dto';

@Controller('publisher')
export class PublisherController {
    constructor(private readonly publisherService: PublisherService) { }

    // @Post('create')
    // async createPublisher(@Body() createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    //     return this.publisherService.createPublisher(createPublisherDto);
    // }

    // check all publisher
    @UseGuards(PublisherAuthGuard)
    @Get('allpublisher')
    async getPublisher(): Promise<Publisher[]> {
        return this.publisherService.getAllPublisher()
    }

    // check detail a publisher
    @UseGuards(PublisherAuthGuard)
    @Get(':publisherName')
    async getDetailPublisher(@Param('publisherName') publisherName: string): Promise<PublisherDocument> {
        return this.publisherService.getByPublisherName(publisherName);
    }

    // update publisher
    @UseGuards(PublisherAuthGuard)
    @Post('update')
    async updatePublisher(@Body() body: UpdatePublisherDto): Promise<boolean> {
        return this.publisherService.updatePublisher(body)
    }

    // delete publisher 
    @UseGuards(PublisherAuthGuard)
    @Post('delete/:publisherName')
    async deletePublisher(@Param('publisherName') publisherName: string): Promise<boolean> {
        return this.publisherService.deletePublisher(publisherName)
    }
}
