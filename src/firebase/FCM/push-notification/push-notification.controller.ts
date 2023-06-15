import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PushTokenNotificationDto } from './dto/push-token-notification.dto';
import { PushTopicNotificationDto } from './dto/push-topic-notification.dto';
import { PushNotificationService } from './push-notification.service';
import { PublisherAuthGuard } from 'src/auth/publishers-auth/guards/auth.guard';

@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @UseGuards(PublisherAuthGuard)
  @Post('token')
  async sendToken(@Body() pushTokenNotificationDto: PushTokenNotificationDto) {
    console.log(`method called ${this.sendToken.name}()`);
    return await this.pushNotificationService.sendToken(
      pushTokenNotificationDto,
    );
  }
  @Post('topic')
  async sendTopic(@Body() pushTopicNotificationDto: PushTopicNotificationDto) {
    console.log(`method called ${this.sendTopic.name}()`);
    return await this.pushNotificationService.sendTopic(
      pushTopicNotificationDto,
    );
  }
}
