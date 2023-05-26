import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UuidService } from './uuid.service';
import { Uuid, UuidSchema } from './schema/Uuid.schema';
import { UuidRepository } from './repository/Uuid.repository';
import { UuidController } from './uuid.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Uuid.name, schema: UuidSchema }]),
  ],
  providers: [UuidService, UuidRepository],
  exports: [UuidService],
  controllers: [UuidController],
})
export class UuidModule {}
