import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from '../../image/image.module';
import { ChapterModule } from '../chapter/chapter.module';
import { CategoryModule } from '../../category/category.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Comic, ComicSchema } from './schema/comic.schema';
import { ComicController } from './comic.controller';
import { ComicRepository } from './repository/comic.repository';
import { ComicService } from './comic.service';

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads',
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            limits: {
                fileSize: 5 * 1024 * 1024, // Giới hạn dung lượng file 5MB
            },
        }),
        MongooseModule.forFeature([{ name: Comic.name, schema: ComicSchema }]),
        ImageModule,
        forwardRef(() => ChapterModule),
        CategoryModule,
    ],
    controllers: [ComicController],
    providers: [ComicService, ComicRepository],
    exports: [ComicService, ComicRepository],
})
export class ComicModule { }
