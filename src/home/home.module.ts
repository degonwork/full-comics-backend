import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { ChapterModule } from '../full-comics/chapter/chapter.module';
import { CommicModule } from '../full-comics/commic/commic.module';
import { ImageModule } from '../image/image.module';
import { HomeRepository } from './repository/home.repository';

@Module({
  imports: [ChapterModule, CommicModule, ImageModule],
  providers: [HomeService, HomeRepository],
  controllers: [HomeController],
})
export class HomeModule {}
