import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { ChapterModule } from 'src/full-comics/chapter/chapter.module';
import { CommicModule } from 'src/full-comics/commic/commic.module';

@Module({
  imports: [ChapterModule, CommicModule],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
