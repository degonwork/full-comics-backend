import { Body, Controller, Post } from '@nestjs/common';
import { CommicService } from './commic.service';
import { CreateCommicDto } from './dto/create-commic.dto';

@Controller('commic')
export class CommicController {
    constructor(private readonly commicService: CommicService){}

    @Post('create')
    async createCommic(@Body() createCommicDto: CreateCommicDto) {
        return this.commicService.createCommic(createCommicDto)
    }
}
