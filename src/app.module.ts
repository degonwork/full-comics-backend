import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChapterModule } from './full-comics/chapter/chapter.module';
import { PublisherModule } from './publisher/publisher.module';
import { ImageModule } from './image/image.module';
import { CommicModule } from './full-comics/commic/commic.module';
import { ChapterReadModule } from './chapter-read/chapter-read.module';
import { CategoryModule } from './category/category.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env"] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({ uri: configService.get("MONGO_URI") }),
      inject: [ConfigService],
    }),
    ChapterReadModule,
    AuthModule,
    UserModule,
    CommicModule,
    ChapterModule,
    PublisherModule,
    ImageModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
