import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommicService } from './commic.service';
import { CreateCommicDto } from './dto/create-commic.dto';
import { Commic, CommicDocument } from './schema/commic.schema';

@Controller('commic')
export class CommicController {
    constructor(private readonly commicService: CommicService){}

    @Post('create')
    async createCommic(@Body() createCommicDto: CreateCommicDto): Promise<CommicDocument> {
        return this.commicService.createCommic(createCommicDto);
    }

    @Get(":id") 
    async findCommicById(@Param("id") id: string) : Promise<Commic> {
        return this.commicService.findCommicById(id);
    }
}
