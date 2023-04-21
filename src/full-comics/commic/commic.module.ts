import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Commic, CommicSchema } from './schema/commic.schema';
import { CommicController } from './commic.controller';
import { CommicService } from './commic.service';
import { ImageModule } from '../../image/image.module';
import { CommicRepository } from './repository/commic.repository';
import { ChapterModule } from '../chapter/chapter.module';
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
                    const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            limits: {
                fileSize: 5 * 1024 * 1024, // Giới hạn dung lượng file 5MB
            },
        }),
        MongooseModule.forFeature([{ name: Commic.name, schema: CommicSchema }]),
        ImageModule,
        forwardRef(() => ChapterModule),
        CategoryModule,
    ],
    controllers: [CommicController],
    providers: [CommicService, CommicRepository],
    exports: [CommicService, CommicRepository],
})
export class CommicModule { }
