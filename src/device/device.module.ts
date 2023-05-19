import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './schema/device.schema';
import { DeviceRepository } from './repository/devince.repository';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  providers: [DeviceService, DeviceRepository],
  exports: [DeviceService],
  controllers: [DeviceController]
})
export class DeviceModule {}
