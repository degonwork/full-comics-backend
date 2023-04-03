import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Commic, CommicSchema } from './schema/commic.schema';
import { CommicController } from './commic.controller';
import { CommicService } from './commic.service';
import { ImageModule } from '../../image/image.module';
import { CommicRepository } from './repository/commic.repository';
import { ChapterModule } from '../chapter/chapter.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Commic.name, schema: CommicSchema}]),
        ImageModule,
        forwardRef(() => ChapterModule)
    ],
    controllers: [CommicController],
    providers: [CommicService, CommicRepository],
    exports: [CommicService, CommicRepository],
})
export class CommicModule {}
