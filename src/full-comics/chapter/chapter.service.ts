import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model} from 'mongoose';
import { CommicService } from '../commic/commic.service';
import { UpdateCommicDto } from '../commic/dto/update-commic.dto';
import { CommicRepository } from '../commic/repository/commic.repository';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ChapterRepository } from './repository/chapter.repository';
import { Chapter, ChapterDocument } from './schema/chapter.schema';

@Injectable()
export class ChapterService {
    constructor(
        private readonly chapterRepository: ChapterRepository,
        private readonly commicService: CommicService,
        ) {}
     
    async createChapter(createChapterDto: CreateChapterDto): Promise<ChapterDocument> {
        let updateCommicDto = new UpdateCommicDto();
        updateCommicDto.chapters = [];
        createChapterDto.reads = 0;
        const chapter =  await this.chapterRepository.createObject(createChapterDto);
        updateCommicDto.chapters.push(chapter._id);
        await this.commicService.findCommicByIdAndUpdate(createChapterDto.commic_id, updateCommicDto);
        return chapter;
    }

    async findChapterById(_id: string) : Promise<Chapter> {
        return this.chapterRepository.findOneObject({_id});
    }

    async findChapter() : Promise<Chapter[]> {
        return this.chapterRepository.findObject();
    }
}
    

