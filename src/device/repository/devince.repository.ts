import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../repository/entity.repository';
import { Device, DeviceDocument } from '../schema/device.schema';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class DeviceRepository extends EntityRepository<DeviceDocument> {
  constructor(
    @InjectModel(Device.name)
    private readonly deviceModel: Model<DeviceDocument>,
    imageService: ImageService,
  ) {
    super(deviceModel, imageService);
  }
}
