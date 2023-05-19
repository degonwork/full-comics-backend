import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('create')
  async sendToken(@Body() CreateDeviceDto: CreateDeviceDto) {
    return await this.deviceService.createDevice(CreateDeviceDto);
  }
}
