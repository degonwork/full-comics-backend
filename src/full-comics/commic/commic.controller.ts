import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommonConnectionOptions } from 'tls';
import { CommicService } from './commic.service';
import { CreateCommicDto } from './dto/create-commic.dto';
import { LimitCommic } from './dto/limit-commic.dto';
import { Commic, CommicDocument } from './schema/commic.schema';

@Controller('commic')
export class CommicController {
    constructor(private readonly commicService: CommicService){}

    @Post('create')
    async createCommic(@Body() createCommicDto: CreateCommicDto): Promise<CommicDocument> {
        return this.commicService.createCommic(createCommicDto);
    }

    @Get("/detail-commic/:id") 
    async findCommicById(@Param("id") id: string) : Promise<Commic | Commic[]> {
        return this.commicService.findCommicById(id);
    }
 
    @Get('hot-commic')
    async findHotCommic(@Query() query: LimitCommic): Promise<Commic[]> {
        return this.commicService.findHotCommic(query.limit);
    }

    @Get('new-commic')
    async findNewCommic(@Query() query: LimitCommic): Promise<Commic[]> {
        return this.commicService.findNewCommic(query.limit);
    }
}
