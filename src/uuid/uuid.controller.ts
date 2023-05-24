import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UuidService } from './uuid.service';
import { CreateUuidDto } from './dto/create-uuid.dto';

@Controller('uuid')
export class UuidController {
  constructor(private readonly uuidService: UuidService) {}

  @Post('create')
  async sendToken(@Body() createUuidDto: CreateUuidDto) {
    return await this.uuidService.createUuid(createUuidDto);
  }
}
