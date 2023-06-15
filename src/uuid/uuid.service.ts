import { Injectable } from '@nestjs/common';
import { CreateUuidDto } from './dto/create-uuid.dto';
import { UuidRepository } from './repository/uuid.repository'
import { UuidDocument } from './schema/uuid.schema';

@Injectable()
export class UuidService {
  constructor(private readonly uuidRepository: UuidRepository) {}

  async createUuid(createUuidDto: CreateUuidDto) {
    const existingUuid = await this.findByUuid(createUuidDto.uuid);
    if (existingUuid) {
      if (existingUuid.firebase_token === createUuidDto.firebase_token) {
        return 'Uuid Existed!';
      }
      existingUuid.firebase_token = createUuidDto.firebase_token;
      const uuidUpdated = await existingUuid.save();
      return uuidUpdated;
    }
    return this.uuidRepository.createObject(createUuidDto);
  }
  async findByUuid(uuid: string): Promise<UuidDocument> {
    try {
      const result: UuidDocument | null =
        await this.uuidRepository.findOneObject({ uuid });
      if (result) {
        return result;
      } else {
        throw new Error('UUID not found');
      }
    } catch (error) {
      throw new Error(`Error finding by UUID: ${error.message}`);
    }
  }
}
