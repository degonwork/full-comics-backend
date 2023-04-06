import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ChapterReadService } from 'src/chapter-read/chapter-read.service';
import { ImageService } from 'src/image/image.service';
import { CommicService } from '../commic/commic.service';
import { UpdateCommicDto } from '../commic/dto/update-commic.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ResponseChapter } from './dto/response-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { UpdateChaptersCommic } from './dto/update-chapters-commic.dto';
import { ChapterRepository } from './repository/chapter.repository';
import { Chapter, ChapterDocument } from './schema/chapter.schema';
import { Image} from '../../image/schema/image.schema';


@Injectable()
export class ChapterService {
    constructor(
        @Inject(forwardRef(() => CommicService)) private commicService: CommicService,
        private readonly chapterRepository: ChapterRepository,
        private readonly chapterReadService: ChapterReadService,
        private readonly imageService: ImageService,
    ) { }

    async createChapter(createChapterDto: CreateChapterDto): Promise<ChapterDocument> {
        let updateCommicDto = new UpdateCommicDto([], '');
        // createChapterDto.reads = updateCommicDto.reads;
        const chapter = await this.chapterRepository.createObject(createChapterDto);
        const image =  (await this.imageService.findImageById(chapter.image_id)).path;
        const updateChaptersCommic = new UpdateChaptersCommic(chapter._id, image,chapter.chapter_intro);
        updateCommicDto.chapters = (await this.commicService.findCommicById(createChapterDto.commic_id)).commic.chapters;
        updateCommicDto.chapters.push(updateChaptersCommic);
        updateCommicDto.new_update_time = chapter.publish_date;
        await this.commicService.findCommicByIdAndUpdate(createChapterDto.commic_id, updateCommicDto);
        return chapter;
    }

    async findChapterById(_id: string) : Promise<any> {
        const chapter = await this.chapterRepository.findOneObject({ _id });
        const image = (await this.imageService.findImageById(chapter.image_id)).path;
        return {...new ResponseChapter(chapter, image)};
    }

    async readChapter(id: string, uuid: string): Promise<Image[]> {
        const listImage = [];
        const chapter = (await this.findChapterById(id)).chapter;
        const chapterRead = await this.chapterReadService.createChapterRead(uuid, {
            chapter_id: id,
            commic_id: chapter.commic_id,
        });
        if (chapterRead) {
            chapter.reads += 1;
            await this.findChapterByIdAndUpdate(id , new UpdateChapterDto(chapter.reads));
            console.log('create successfull');
        } else {
            console.log('Dont create');
        }
        for(const image_id of chapter.chapter_content) {
            const image =  await this.imageService.findImageById(image_id);
            listImage.push(image);
        }
        return listImage;
    }

    async findChapter(): Promise<Chapter[]> {
        return this.chapterRepository.findObject();
    }

    async findChapterByIdAndUpdate(_id: string, updateChapterDto: UpdateChapterDto): Promise<Chapter> {
        return this.chapterRepository.findOneObjectAndUpdate({ _id }, updateChapterDto);
    }

}


