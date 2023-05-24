import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../repository/entity.repository';
import { Uuid, UuidDocument } from '../schema/Uuid.schema';

@Injectable()
export class UuidRepository extends EntityRepository<UuidDocument> {
  constructor(
    @InjectModel(Uuid.name)
    private readonly uuidModel: Model<UuidDocument>,
  ) {
    super(uuidModel, null);
  }
}
