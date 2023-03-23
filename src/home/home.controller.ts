import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService:HomeService) {}

    @Get()
    async getHomeData() : Promise<Object> {
        return this.homeService.getHomeData();
    }
}
