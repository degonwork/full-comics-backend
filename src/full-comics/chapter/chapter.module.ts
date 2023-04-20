import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema, } from './schema/chapter.schema';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { ImageModule } from '../../image/image.module';
import { ChapterRepository } from './repository/chapter.repository';
import { CommicModule } from '../commic/commic.module';
import { CommicService } from '../commic/commic.service';
import { ChapterReadModule } from '../../chapter-read/chapter-read.module';
import { CategoryModule } from '../../category/category.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: 'src/uploads',
                filename: (req, file, callback) => {
                    const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
                    callback(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
        MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
        ImageModule,
        forwardRef(() => CommicModule),
        ChapterReadModule,
        CategoryModule,
    ],
    controllers: [ChapterController],
    providers: [ChapterService, ChapterRepository, CommicService],
    exports: [ChapterService],
})
export class ChapterModule { }
