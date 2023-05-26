import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/users-auth/guards/auth.guard';
import { CreateUUIDUserDto } from './dto/create-uuid-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('profile')
  @UseGuards(UserAuthGuard)
  async getprofile(@Req() req: any) {
    // return this.userService.getUserProfile(req);
  }

  @Post(':uuid')
  async createUUID(@Body() createUUIDUserDto: CreateUUIDUserDto) {
    return this.userService.createUUIDUser(createUUIDUserDto);
  }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
