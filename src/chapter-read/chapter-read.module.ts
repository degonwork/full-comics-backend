import { Module } from '@nestjs/common';
import { ChapterReadService } from './chapter-read.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterRead, ChapterReadSchema } from './schema/chapter-read.schema';
import { ChapterReadController } from './chapter-read.controller';
import { UserModule } from '../user/user.module';
import { ChapterReadRepository } from './repository/chapter-read.repository';
import { ComicModule } from '../full-comics/comic/comic.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name:ChapterRead.name, schema: ChapterReadSchema}]),
    ComicModule,
    UserModule,
  ],
  providers: [ChapterReadService, ChapterReadRepository],
  controllers: [ChapterReadController],
  exports: [ChapterReadService]
})
export class ChapterReadModule {}
