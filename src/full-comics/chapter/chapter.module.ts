import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChaptersSchema } from './schema/chapter.schema';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { ImageModule } from '../../image/image.module';
import { ChapterRepository } from './repository/chapter.repository';
import { CommicModule } from '../commic/commic.module';
import { CommicService } from '../commic/commic.service';
import { CommicRepository } from '../commic/repository/commic.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Chapter.name, schema: ChaptersSchema}]),
        ImageModule,
        CommicModule,
    ],
    controllers: [ChapterController],
    providers: [ChapterService, ChapterRepository, CommicService],
    exports:  [ChapterService],
})
export class ChapterModule {}
