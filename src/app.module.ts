import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommicModule } from './commic/commic.module';
import { ChapterModule } from './chapter/chapter.module';
import { PublisherModule } from './publisher/publisher.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env"] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({ uri: configService.get("MONGO_URI") }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    CommicModule,
    ChapterModule,
    PublisherModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
