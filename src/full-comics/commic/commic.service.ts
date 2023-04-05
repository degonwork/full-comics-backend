import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Commic, CommicDocument } from './schema/commic.schema';
import { CreateCommicDto } from './dto/create-commic.dto';
import { CommicRepository } from './repository/commic.repository';
import { UpdateCommicDto } from './dto/update-commic.dto';
import { ImageService } from 'src/image/image.service';
import { ResponseCommic } from './dto/response-commic.dto';
import { ChapterService } from '../chapter/chapter.service';

@Injectable()
export class CommicService {
    constructor(
        @Inject(forwardRef(() => ChapterService)) private readonly chapterService: ChapterService,
        private readonly commicRepository: CommicRepository,
        private readonly imageService: ImageService,

    ) { }

    async getCommicOption(commic: CommicDocument, isDetail: boolean): Promise<any> {
        console.log(commic.image_id);
        const image = (await this.imageService.findImageById(commic.image_id)).path;
        if (!isDetail) { return new ResponseCommic(commic, image); }
        return {
            id: commic._id,
            title: commic.title,
            image: (await this.imageService.findImageById(commic.image_id)).path,
        }
    }

    async createCommic(createCommicDto: CreateCommicDto): Promise<CommicDocument> {
        // createCommicDto.reads = 0;
        return await this.commicRepository.createObject(createCommicDto);
    }

    async findCommicById(_id: string): Promise<CommicDocument> {
        return this.commicRepository.findOneObject({ _id });
    }

    async findCommicByIdAndUpdate(_id: string, updateCommicDto: UpdateCommicDto): Promise<Commic> {
        return this.commicRepository.findOneObjectAndUpdate({ _id }, updateCommicDto);
    }

    async findHotCommic(limit?: number): Promise<any> {
        const hotCommics = await this.commicRepository.findObject(limit);
        let responeHotCommics = <any>[];
        hotCommics.sort((a, b) => { return b.reads - a.reads; });
        for (const hotCommic of hotCommics) {
            const responseHotCommic = await this.getCommicOption(hotCommic, true);
            responeHotCommics.push(responseHotCommic);
        }
        return responeHotCommics;
    }

    async findNewCommic(limit?: number): Promise<any> {
        const newCommics = await this.commicRepository.findObject(limit);
        let responeNewCommics = <any>[];
        newCommics.sort((a, b) => {
            return this._toTimeStamp(b.new_update_time) - this._toTimeStamp(a.new_update_time);
        });
        for (const newCommic of newCommics) {
            const responeNewCommic = await this.getCommicOption(newCommic, true);
            responeNewCommics.push(responeNewCommic);
        }
        return responeNewCommics;
    }

    _toTimeStamp(strDate: string): number {
        let datum = Date.parse(strDate);
        return datum / 1000;
    }
}
