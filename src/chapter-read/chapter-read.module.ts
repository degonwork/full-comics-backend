import { Module } from '@nestjs/common';
import { ChapterReadService } from './chapter-read.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterRead, ChapterReadSchema } from './schema/chapter-read.schema';
import { ChapterReadController } from './chapter-read.controller';
import { UserModule } from '../user/user.module';
import { ChapterReadRepository } from './repository/chapter-read.repository';
import { CommicModule } from '../full-comics/commic/commic.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name:ChapterRead.name, schema: ChapterReadSchema}]),
    CommicModule,
    UserModule,
  ],
  providers: [ChapterReadService, ChapterReadRepository],
  controllers: [ChapterReadController],
  exports: [ChapterReadService]
})
export class ChapterReadModule {}
