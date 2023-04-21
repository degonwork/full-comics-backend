import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ChapterReadService } from '../../chapter-read/chapter-read.service';
import { ImageService } from '../../image/image.service';
import { CommicService } from '../commic/commic.service';
import { UpdateCommicDto } from '../commic/dto/update-commic.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ResponseChapter } from './dto/response-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { UpdateChaptersCommic } from './dto/update-chapters-commic.dto';
import { ChapterRepository } from './repository/chapter.repository';
import { Chapter, ChapterDocument } from './schema/chapter.schema';
import { ImageDocument } from '../../image/schema/image.schema';
import { CreateChapterContentDto } from './dto/create-chapter-content.dto';
import { CreateImageDto } from 'src/image/dto/create-image.dto';

@Injectable()
export class ChapterService {
    constructor(
        @Inject(forwardRef(() => CommicService)) private commicService: CommicService,
        private readonly chapterRepository: ChapterRepository,
        private readonly chapterReadService: ChapterReadService,
        private readonly imageService: ImageService,
    ) { }


    // Tạo chapter = upload file
    async createChapterFile(createChapterDto: CreateChapterDto, reqUser: any, imageContent: Express.Multer.File): Promise<ChapterDocument> {
        let updateCommicDto = new UpdateCommicDto([], '');
        let listCreateChapterContent: CreateChapterContentDto[] = []

        // Tạo content 
        for (const imageChapterContent of createChapterDto.chapter_content) {

            const imageFileChapterContent = await this.imageService.createImageFile(imageChapterContent, imageContent);
            console.log(imageFileChapterContent);
            

            const createChapterContent = new CreateChapterContentDto(imageFileChapterContent.id, imageFileChapterContent.path, imageFileChapterContent.type);

            listCreateChapterContent.push(createChapterContent);
        }


        createChapterDto.chapter_content = listCreateChapterContent;
        createChapterDto.publish_date = new Date().toLocaleString('en-GB', { hour12: false });
        //Tao publisher_id
        createChapterDto.publisher_id = reqUser.id;
        const chapter = await this.chapterRepository.createObject(createChapterDto);
        // const image = (await this.imageService.findImageById(chapter.image_banner_id)).path;
        const updateChaptersCommic = new UpdateChaptersCommic(chapter._id, chapter.chapter_intro);
        updateCommicDto.chapters = (await this.commicService.findCommicById(createChapterDto.commic_id)).commic.chapters;
        updateCommicDto.chapters.push(updateChaptersCommic);
        updateCommicDto.new_update_time = chapter.publish_date;
        await this.commicService.findCommicByIdAndUpdate(createChapterDto.commic_id, updateCommicDto);
        await this.commicService.findCommicByIdAndSetComicPublisher(createChapterDto.commic_id, createChapterDto.publisher_id);
        return chapter;
    }



    // Tạo chapter = link
    async createChapter(createChapterDto: CreateChapterDto, reqUser: any): Promise<ChapterDocument> {
        let updateCommicDto = new UpdateCommicDto([], '');
        let listCreateChapterContent: CreateChapterContentDto[] = []
        // createChapterDto.reads = updateCommicDto.reads;
        const newChapter = Object.assign(createChapterDto);

        // Tạo content
        for (const imageChapterContent of createChapterDto.chapter_content) {
            const imageIdChapterContent = await this.chapterRepository.createImage(imageChapterContent);
            const createChapterContent = new CreateChapterContentDto(imageIdChapterContent, imageChapterContent.path, imageChapterContent.type);
            listCreateChapterContent.push(createChapterContent);
        }
        newChapter.chapter_content = listCreateChapterContent;
        newChapter.publish_date = new Date().toLocaleString('en-GB', { hour12: false });
        //Tao publisher_id
        newChapter.publisher_id = reqUser.id;
        const chapter = await this.chapterRepository.createObject(createChapterDto);
        const updateChaptersCommic = new UpdateChaptersCommic(chapter._id, chapter.chapter_intro);
        updateCommicDto.chapters = (await this.commicService.findCommicById(createChapterDto.commic_id)).commic.chapters;
        updateCommicDto.chapters.push(updateChaptersCommic);
        updateCommicDto.new_update_time = chapter.publish_date;
        await this.commicService.findCommicByIdAndUpdate(createChapterDto.commic_id, updateCommicDto);
        await this.commicService.findCommicByIdAndSetComicPublisher(createChapterDto.commic_id, newChapter.publisher_id);
        return chapter;
    }

    async findChapterById(_id: string): Promise<any> {
        const chapter = await this.chapterRepository.findOneObject({ _id });
        const image = (await this.imageService.findImageById(chapter.id)).path;
        return { ...new ResponseChapter(chapter, image) };
    }
    async findPhotoById(_id: string): Promise<any> {
        const image = await this.chapterRepository.findOneObject({ _id });
        return image;
    }
    async detailChapter(id: string, uuid: string): Promise<ChapterDocument> {
        const chapter = (await this.findChapterById(id)).chapter;
        const chapterRead = await this.chapterReadService.createChapterRead(uuid, {
            chapter_id: id,
            commic_id: chapter.commic_id,
        });
        if (chapterRead) {
            chapter.reads += 1;
            await this.findChapterByIdAndUpdate(id, new UpdateChapterDto(chapter.reads));
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

    async findAllChaptersByPublisherId(publisherId: any): Promise<ChapterDocument[]> {
        return await this.chapterRepository.findObjectesBy('publisher_id', publisherId);
    }


    async createImageFile(createImageDto: CreateImageDto, file: Express.Multer.File): Promise<ImageDocument> {
        return await this.imageService.createImageFile(createImageDto, file)
    }
}


