import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ChapterModule } from './full-comics/chapter/chapter.module';
import { PublisherModule } from './publisher/publisher.module';
import { ImageModule } from './image/image.module';
import { ComicModule } from './full-comics/comic/comic.module';
import { ChapterReadModule } from './chapter-read/chapter-read.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/users-auth/user.auth.module';
import { PublisherAuthModule } from './auth/publishers-auth/publisher.auth.module';
import { PushNotificationModule } from './firebase/FCM/push-notification/push-notification.module';
import { DeviceModule } from './device/device.module';
import { TransactionModule } from './transaction/transaction.module';
import { UuidModule } from './uuid/uuid.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    ChapterReadModule,
    AuthModule,
    PublisherAuthModule,
    UserModule,
    ComicModule,
    ChapterModule,
    PublisherModule,
    ImageModule,
    CategoryModule,
    PushNotificationModule,
    DeviceModule,
    TransactionModule,
    UuidModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
