import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { ChapterModule } from 'src/full-comics/chapter/chapter.module';
import { CommicModule } from 'src/full-comics/commic/commic.module';
import { ImageModule } from 'src/image/image.module';
import { HomeRepository } from './dto/repository/home.repository';

@Module({
  imports: [ChapterModule, CommicModule, ImageModule],
  providers: [HomeService, HomeRepository],
  controllers: [HomeController],
})
export class HomeModule {}
