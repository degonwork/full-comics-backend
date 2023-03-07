import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    @Get('profile')
    @UseGuards(AuthGuard())
    async getprofile(@Req() req : any) {
        return req.user;
    }
}
