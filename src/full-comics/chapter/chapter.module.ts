import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChaptersSchema } from './schema/chapter.schema';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { ImageModule } from 'src/image/image.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Chapter.name, schema: ChaptersSchema}]),
        ImageModule,
    ],
    controllers: [ChapterController],
    providers: [ChapterService],
    exports:  [ChapterService],
})
export class ChapterModule {}
