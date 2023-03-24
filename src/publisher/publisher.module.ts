import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publisher, PublisherSchema } from './schema/publisher.schema';
import { PublisherService } from './publisher.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Publisher.name, schema: PublisherSchema}]),
    ],
    providers: [PublisherService]
})
export class PublisherModule {}
