import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/users-auth/guards/auth.guard';
import { CreateUUIDUserDto } from './dto/create-uuid-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('profile')
    @UseGuards(UserAuthGuard)
    async getprofile(@Req() req : any) {
        return req.user;
    }

    @Post(':uuid')
    async create(@Body() createUUIDUserDto: CreateUUIDUserDto) {
        return this.userService.createUUIDUser(createUUIDUserDto);
    }
}
