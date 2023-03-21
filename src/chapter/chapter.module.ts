import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapters, ChaptersSchema } from './schema/chapter.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Chapters.name, schema: ChaptersSchema}]),
    ]
})
export class ChapterModule {}
