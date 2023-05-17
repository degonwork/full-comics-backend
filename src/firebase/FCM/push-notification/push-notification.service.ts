import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from '../../../../push-notification-google-service.json';
import { PushTokenNotificationDto } from './dto/push-token-notification.dto';
import { PushTopicNotificationDto } from './dto/push-topic-notification.dto';
import { ComicService } from 'src/full-comics/comic/comic.service';

@Injectable()
export class PushNotificationService {
  constructor(private readonly comicService: ComicService) {
    console.log('constructor called()');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
    console.log('constructor executed()');
  }
  async sendToken(pushTokenNotificationDto: PushTokenNotificationDto) {
    let { title, body, token } = pushTokenNotificationDto;
    // const comic = await this.comicService.findComicById(title);
    // const comicName = comic.title;
    const payload = {
      notification: {
        // title: comicName,
        title,
        body,
      },
      click_action: process.env.CLICK_ACTION,
    };
    Promise.all([await admin.messaging().sendToDevice(token, payload)]);
  }

  async sendTopic(pushTopicNotificationDto: PushTopicNotificationDto) {
    let { title, body, topic } = pushTopicNotificationDto;
    // const comic = await this.comicService.findComicById(title);
    // const comicName = comic.title;

    const payload = {
      notification: {
        // title: comicName,
        title,
        body,
      },
      click_action: process.env.CLICK_ACTION,
    };
    Promise.all([await admin.messaging().sendToTopic(topic, payload)]);
  }
}
