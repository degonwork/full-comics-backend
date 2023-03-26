import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publisher, PublisherSchema } from './schema/publisher.schema';
import { PublisherService } from './publisher.service';
import { PublisherRepository } from './repository/publisher.repository';
import { ImageModule } from 'src/image/image.module';
import { PublisherController } from './publisher.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Publisher.name, schema: PublisherSchema}]),
        ImageModule,
    ],
    providers: [PublisherService, PublisherRepository],
    controllers: [PublisherController]
})
export class PublisherModule {}
