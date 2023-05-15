import { Inject, Injectable, forwardRef } from "@nestjs/common";
import * as admin from 'firebase-admin'
import { ServiceAccount } from 'firebase-admin'
import * as serviceAccount from '../../../../push-notification-google-service.json'
import { PushNotificationDto } from "./dto/push-notification.dto";
import { ComicService } from "src/full-comics/comic/comic.service";

@Injectable()
export class PushNotificationService {
    constructor(
        private readonly comicService: ComicService,
    ) {
        console.log('constructor called()');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as ServiceAccount)
        })
        console.log('constructor executed()');

    }
    async send(pushNotificationDto: PushNotificationDto) {
        let { title, body, token } = pushNotificationDto
        const comic = await this.comicService.findComicById(title)
        const comicName = comic.title
        const payload = {
            notification: {
                title: comicName,
                body
            }
        }
        Promise.all([await admin.messaging().sendToDevice(token, payload)]);

    }
}