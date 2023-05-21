import { Injectable } from '@nestjs/common';
import { DeviceRepository } from './repository/device.repository';
import { DeviceDocument } from './schema/device.schema';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DeviceService {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async createDevice(createDeviceDto: CreateDeviceDto) {
    const existingDevice = await this.findDevice(createDeviceDto.device_id);
    if (existingDevice) {
      return 'Device Existed!';
    }
    return this.deviceRepository.createObject(createDeviceDto);
  }

  async findDevice(device_id: string): Promise<DeviceDocument> {
    return this.deviceRepository.findOneObject({ device_id });
  }
}
