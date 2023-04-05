import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
        @Inject(forwardRef(() => CommicService)) private commicService: CommicService,
        private readonly chapterRepository: ChapterRepository,
        private readonly chapterReadService: ChapterReadService,

    ) { }

    async createChapter(createChapterDto: CreateChapterDto): Promise<ChapterDocument> {
        let updateCommicDto = new UpdateCommicDto([], '');
        // createChapterDto.reads = updateCommicDto.reads;
        const chapter = await this.chapterRepository.createObject(createChapterDto);
        updateCommicDto.chapters = (await this.commicService.findCommicById(createChapterDto.commic_id)).chapters;
        updateCommicDto.chapters.push(chapter._id);
        updateCommicDto.new_update_time = chapter.publish_date;
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

    async findChapterByIdWithoutUUID(_id: string): Promise<ChapterDocument> {
        return this.chapterRepository.findOneObject({ _id });
    }

    async findChapter(): Promise<Chapter[]> {
        return this.chapterRepository.findObject();
    }

    async findChapterByIdAndUpdate(_id: string, updateChapterDto: UpdateChapterDto): Promise<Chapter> {
        return this.chapterRepository.findOneObjectAndUpdate({ _id }, updateChapterDto);
    }

}


