import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publisher, PublisherSchema } from './schema/publisher.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Publisher.name, schema: PublisherSchema}]),
    ]
})
export class PublisherModule {}
