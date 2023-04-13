import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublisherRepository } from './repository/publisher.repository';
import { Publisher, PublisherDocument } from './schema/publisher.schema';
import * as bcrypt from 'bcrypt';
import { UpdatePublisherDto } from './dto/update-publisher.dto';


@Injectable()
export class PublisherService {
    constructor(
        private readonly publisherRepository: PublisherRepository

    ) { }


    //Brycpt
    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    // Kiem tra nguoi dung 
    async validatePublisher(publisherName: string, password: string) {
        const publisher = await this.findbyPublishername(publisherName);
        if (!publisher) return null;
        const doesPasswordMath = await bcrypt.compare(password, publisher.password);
        if (!doesPasswordMath) return null;
        return this.getDetailPublisher(publisher);
    }


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
    async updateRefreshToken(publisherName: string, update: any) {
        const existingPublisher = await this.publisherRepository.findOneObject({ publisherName });
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

    // get publisher detail
    async getByPublisherName(publisherName: string): Promise<PublisherDocument> {
        const publisher = this.publisherRepository.findOneObject({ publisherName });
        if (!publisher) {
            throw new HttpException("not found publisher", HttpStatus.UNAUTHORIZED);

        }
        return publisher;
    }

    // update publisher
    async updatePublisher(body: UpdatePublisherDto) {
        const publisher = this.getByPublisherName(body.publisherName)
        try {
            if (!publisher) {
                throw new HttpException("not found publisher", HttpStatus.UNAUTHORIZED);
            }
            body.password = await this.hashPassword(body.password);
            await this.publisherRepository.findOneObjectAndUpdate(publisher, body);
            return true

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

}
