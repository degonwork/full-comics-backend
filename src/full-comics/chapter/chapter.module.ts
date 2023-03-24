import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChaptersSchema } from './schema/chapter.schema';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { ImageModule } from '../../image/image.module';
import { ChapterRepository } from './repository/chapter.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Chapter.name, schema: ChaptersSchema}]),
        ImageModule,
    ],
    controllers: [ChapterController],
    providers: [ChapterService, ChapterRepository],
    exports:  [ChapterService],
})
export class ChapterModule {}
