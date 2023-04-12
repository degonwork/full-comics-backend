import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublisherRepository } from './repository/publisher.repository';
import { Publisher, PublisherDocument } from './schema/publisher.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PublisherService {
    constructor(private readonly publisherRepository: PublisherRepository) { }

    //Lay du lieu publisher
    async getDetailPublisher(publisher: PublisherDocument): Promise<any> {
        return {
            id: publisher._id,
            publisherName: publisher.publisherName,
            image_id: publisher.image_id,
        }
    }
    //Tao moi publisher
    async createPublisher(createPublisherDto: CreatePublisherDto): Promise<PublisherDocument> {
        return this.publisherRepository.createObject(createPublisherDto);
    }

    // Tim kiem publisher theo publisherName
    async findbyPublishername(publisherName: string): Promise<PublisherDocument> {
        return this.publisherRepository.findOneObject({ publisherName });
    }


    // Refresh token
    async updateRefreshToken(publisherName: string, update: { refreshToken: any; }) {
        const existingPublisher = await this.findbyPublishername(publisherName);
        if (existingPublisher) {
            if (update.refreshToken) {
                update.refreshToken = await bcrypt.hash(
                    update.refreshToken.split("").reverse().join(""),
                    10,
                );
            }
            existingPublisher.refreshToken = update.refreshToken;
        }
        return existingPublisher.save();
    }
    async getPublisherByRefresh(refreshToken: string, publisherName: string) {
        const publisher = await this.findbyPublishername(publisherName);
        if (!publisher) {
            throw new HttpException("not found publisher", HttpStatus.UNAUTHORIZED);
        }
        const is_equal = await bcrypt.compare(
            refreshToken.split("").reverse().join(""),
            publisher.refreshToken,
        )
        if (!is_equal) {
            throw new HttpException("not found publisher", HttpStatus.UNAUTHORIZED);
        }
        return this.getDetailPublisher(publisher);
    }

    // find all publisher
    async getAllPublisher() {
        try {
            return await this.publisherRepository.findObject()

        } catch {

        }
    }



}
