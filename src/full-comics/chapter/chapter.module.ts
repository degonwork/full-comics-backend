import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema,  } from './schema/chapter.schema';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { ImageModule } from '../../image/image.module';
import { ChapterRepository } from './repository/chapter.repository';
import { CommicModule } from '../commic/commic.module';
import { CommicService } from '../commic/commic.service';
import { ChapterReadModule } from '../../chapter-read/chapter-read.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Chapter.name, schema: ChapterSchema}]),
        ImageModule,
        forwardRef(() => CommicModule),
        ChapterReadModule,
    ],
    controllers: [ChapterController],
    providers: [ChapterService, ChapterRepository, CommicService],
    exports:  [ChapterService],
})
export class ChapterModule {}
