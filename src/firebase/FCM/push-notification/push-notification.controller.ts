import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PushNotificationDto } from "./dto/push-notification.dto";
import { PushNotificationService } from "./push-notification.service";
import { PublisherAuthGuard } from "src/auth/publishers-auth/guards/auth.guard";



@Controller('push-notification')
export class PushNotificationController {
    constructor(
        private readonly pushNotificationService: PushNotificationService,
    ) { }

    @UseGuards(PublisherAuthGuard)
    @Post()
    async send(@Body() pushNotificationDto: PushNotificationDto) {
        console.log(`method called ${this.send.name}()`);
        return await this.pushNotificationService.send(pushNotificationDto)

    }
}