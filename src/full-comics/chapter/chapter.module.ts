import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from './schema/chapter.schema';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { ImageModule } from '../../image/image.module';
import { ChapterRepository } from './repository/chapter.repository';
import { ComicModule } from '../comic/comic.module';
import { ComicService } from '../comic/comic.service';
import { ChapterReadModule } from '../../chapter-read/chapter-read.module';
import { CategoryModule } from '../../category/category.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn dung lượng file 5MB
      },
    }),
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    ImageModule,
    forwardRef(() => ComicModule),
    ChapterReadModule,
    CategoryModule,
  ],
  controllers: [ChapterController],
  providers: [ChapterService, ChapterRepository, ComicService],
  exports: [ChapterService],
})
export class ChapterModule { }
