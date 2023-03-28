import { Injectable } from '@nestjs/common';
import { ChapterReadService } from 'src/chapter-read/chapter-read.service';
import { CommicService } from '../commic/commic.service';
import { UpdateCommicDto } from '../commic/dto/update-commic.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ChapterRepository } from './repository/chapter.repository';
import { Chapter, ChapterDocument } from './schema/chapter.schema';

@Injectable()
export class ChapterService {
    constructor(
        private readonly chapterRepository: ChapterRepository,
        private readonly commicService: CommicService,
        private readonly chapterReadService: ChapterReadService,

    ) { }

    async createChapter(createChapterDto: CreateChapterDto): Promise<ChapterDocument> {
        let updateCommicDto = new UpdateCommicDto([], 0);
        createChapterDto.reads = updateCommicDto.reads;
        const chapter = await this.chapterRepository.createObject(createChapterDto);
        updateCommicDto.chapters = (await this.commicService.findCommicById(createChapterDto.commic_id)).chapters;
        updateCommicDto.chapters.push(chapter._id);
        await this.commicService.findCommicByIdAndUpdate(createChapterDto.commic_id, updateCommicDto);
        return chapter;
    }

    async findChapterById(_id: string, uuid: string): Promise<Chapter> {
        const chapter = await this.chapterRepository.findOneObject({ _id });
        const chapterRead = await this.chapterReadService.createChapterRead(uuid, {
            chapter_id: _id,
            commic_id: chapter.commic_id,
        });
        if (chapterRead) {
            chapter.reads += 1;
            await this.chapterRepository.findOneObjectAndUpdate({ _id }, new UpdateChapterDto(chapter.reads));
            console.log('create successfull');
        } else {
            console.log('Dont create');
        }
        return chapter;
    }

    async findChapter(): Promise<Chapter[]> {
        return this.chapterRepository.findObject();
    }

    async findChapterByIdAndUpdate(_id: string, updateChapterDto: UpdateChapterDto): Promise<Chapter> {
        return this.chapterRepository.findOneObjectAndUpdate({ _id }, updateChapterDto);
    }

}


