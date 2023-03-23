import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Commic, CommicSchema } from './schema/commic.schema';
import { CommicController } from './commic.controller';
import { CommicService } from './commic.service';
import { ImageModule } from 'src/image/image.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Commic.name, schema: CommicSchema}]),
        ImageModule,
    ],
    controllers: [CommicController],
    providers: [CommicService],
    exports: [CommicService],
})
export class CommicModule {}
