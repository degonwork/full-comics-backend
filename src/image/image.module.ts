import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema, Image} from './schema/image.schema';
import { ImageService } from './image.service';
import { ImageRepository } from './repository/image.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Image.name, schema: ImageSchema}]),
    ],
    providers: [ImageService, ImageRepository],
    exports: [ImageService],
})
export class ImageModule {}
