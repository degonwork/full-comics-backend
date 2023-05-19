import { Module } from "@nestjs/common";
import { PushNotificationService } from "./push-notification.service";
import { PushNotificationController } from "./push-notification.controller";
import { ComicModule } from "src/full-comics/comic/comic.module";

@Module({
    imports: [ComicModule],
    providers: [PushNotificationService],
    controllers: [PushNotificationController],
    // exports: [PushNotificationService]
})
export class PushNotificationModule { }
