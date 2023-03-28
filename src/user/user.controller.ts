import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('profile')
    @UseGuards(AuthGuard())
    async getprofile(@Req() req : any) {
        return req.user;
    }

}
