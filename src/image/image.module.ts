import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema, Image } from './schema/image.schema';
import { ImageService } from './image.service';
import { ImageRepository } from './repository/image.repository';
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
        MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    ],
    providers: [ImageService, ImageRepository],
    exports: [ImageService],
})
export class ImageModule { }
