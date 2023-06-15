import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './user.auth.service';
import { ExistingUser } from 'src/user/dto/existing-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('userauth')
export class UserController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() newUser: CreateUserDto) {
    return await this.authService.register(newUser);
  }

  @Post('login')
  async login(@Body() existingUser: ExistingUser) {
    return await this.authService.login(existingUser);
  }

  @Post('refresh')
  async refreshToken(@Body() bodyToken: any) {
    return await this.authService.refresh(bodyToken.refreshToken);
  }
}
