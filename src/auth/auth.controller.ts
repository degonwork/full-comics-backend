import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ExistingUser } from 'src/user/dto/existing-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    register(@Body() newUser: CreateUserDto) {
        return this.authService.register(newUser);
    }

    @Post("login")
    login(@Body() existingUser: ExistingUser) {
        return this.authService.login(existingUser);
    }


}
