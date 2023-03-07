import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ExistingUser } from 'src/user/dto/existing-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    async register(@Body() newUser: CreateUserDto) {
        return await this.authService.register(newUser);
    }

    @Post("login")
    async login(@Body() existingUser: ExistingUser) {
        return await this.authService.login(existingUser);
    }

    @Post("refresh")
    async refreshToken(@Body() bodyToken:any) {
        return await this.authService.refresh(bodyToken.refreshToken);
    }

    @Get("logout")
    @UseGuards(AuthGuard())
    async logout(@Req() req:any) {
        return this.authService.logout(req.user);
    }

}
