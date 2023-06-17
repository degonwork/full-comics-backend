import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PublisherAuthService } from './publisher.auth.service';
import { CreatePublisherDto } from 'src/publisher/dto/create-publisher.dto';
import { ExistingPublisher } from 'src/publisher/dto/existing-publisher.dto';
import { PublisherAuthGuard } from './guards/auth.guard';

@Controller('publisherauth')
export class PublisherAuthController {
  constructor(private publisherAuthService: PublisherAuthService) { }

  @Post('register')
  async register(@Body() newPublisher: CreatePublisherDto) {
    return await this.publisherAuthService.register(newPublisher);
  }

  @Post('login')
  async login(@Body() existingPublisher: ExistingPublisher) {
    return await this.publisherAuthService.login(existingPublisher);
  }

  @Post('refresh')
  async refreshToken(@Body() bodyToken: any) {
    const result = await this.publisherAuthService.refresh(bodyToken.refreshToken)    
    return result;
  }

  @Get('logout')
  @UseGuards(PublisherAuthGuard)
  async logout(@Req() req: any) {
    await this.publisherAuthService.logout(req.user);
    return { message: 'Logout successfully' };
  }
}
