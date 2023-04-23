import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ChapterReadService } from '../../chapter-read/chapter-read.service';
import { ImageService } from '../../image/image.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ResponseChapter } from './dto/response-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ChapterRepository } from './repository/chapter.repository';
import { Chapter, ChapterDocument } from './schema/chapter.schema';
import { ImageDocument } from '../../image/schema/image.schema';
import { CreateChapterContentDto } from './dto/create-chapter-content.dto';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { ComicService } from '../comic/comic.service';
import { UpdateComicDto } from '../comic/dto/update-comic.dto';
import { UpdateChaptersComic } from './dto/update-chapters-comic.dto';

@Injectable()
export class ChapterService {
    constructor(
        @Inject(forwardRef(() => ComicService)) private comicService: ComicService,
        private readonly chapterRepository: ChapterRepository,
        private readonly chapterReadService: ChapterReadService,
        private readonly imageService: ImageService,
    ) { }


    // Tạo chapter = upload file
    async createChapterFile(createChapterDto: CreateChapterDto, reqUser: any, imageThumnail: Express.Multer.File[], imageContents: Express.Multer.File[]): Promise<ChapterDocument> {
        let updateComicDto = new UpdateComicDto([], '');
        let listCreateChapterContent: CreateChapterContentDto[] = []
        // Tạo thumnail
        const imageChapterThumnail = await this.imageService.createImageFile(createChapterDto.image_thumnail[0], imageThumnail[0])
        createChapterDto.image_thumnail = [imageChapterThumnail];

        // Tạo content 
        for (const imageChapterContent of createChapterDto.chapter_content) {
            for (const imageContent of imageContents) {
                const imageFileChapterContent = await this.imageService.createImageFile(imageChapterContent, imageContent);
                const createChapterContent = new CreateChapterContentDto(imageFileChapterContent.id, imageFileChapterContent.path, imageFileChapterContent.type);
                listCreateChapterContent.push(createChapterContent);
            }
        }
        createChapterDto.chapter_content = listCreateChapterContent;
        createChapterDto.publish_date = new Date().toLocaleString('en-GB', { hour12: false });
        //Tao publisher_id
        createChapterDto.publisher_id = reqUser.id;
        const chapter = await this.chapterRepository.createObject(createChapterDto);
        // const image = (await this.imageService.findImageById(chapter.image_banner_id)).path;
        const updateChaptersComic = new UpdateChaptersComic(chapter.id, chapter.chapter_des, chapter.image_thumnail[0].path);
        updateComicDto.chapters = (await this.comicService.findComicById(createChapterDto.comic_id)).chapters;
        updateComicDto.chapters.push(updateChaptersComic);
        updateComicDto.new_update_time = chapter.publish_date;
        await this.comicService.findComicByIdAndUpdate(createChapterDto.comic_id, updateComicDto);
        await this.comicService.findComicByIdAndSetComicPublisher(createChapterDto.comic_id, createChapterDto.publisher_id);
        return chapter;
    }



    // Tạo chapter = link
    // async createChapter(createChapterDto: CreateChapterDto, reqUser: any): Promise<ChapterDocument> {
    //     let updateComicDto = new UpdateComicDto([], '');
    //     let listCreateChapterContent: CreateChapterContentDto[] = []
    //     // createChapterDto.reads = updateComicDto.reads;
    //     const newChapter = Object.assign(createChapterDto);

    //     // Tạo content
    //     for (const imageChapterContent of createChapterDto.chapter_content) {
    //         const imageIdChapterContent = await this.chapterRepository.createImage(imageChapterContent);
    //         const createChapterContent = new CreateChapterContentDto(imageIdChapterContent, imageChapterContent.fileName, imageChapterContent.type);
    //         listCreateChapterContent.push(createChapterContent);
    //     }
    //     newChapter.chapter_content = listCreateChapterContent;
    //     newChapter.publish_date = new Date().toLocaleString('en-GB', { hour12: false });
    //     //Tao publisher_id
    //     newChapter.publisher_id = reqUser.id;
    //     const chapter = await this.chapterRepository.createObject(createChapterDto);
    //     const updateChaptersComic = new UpdateChaptersComic(chapter._id, chapter.chapter_intro);
    //     updateComicDto.chapters = (await this.comicService.findComicById(createChapterDto.comic_id)).comic.chapters;
    //     updateComicDto.chapters.push(updateChaptersComic);
    //     updateComicDto.new_update_time = chapter.publish_date;
    //     await this.comicService.findComicByIdAndUpdate(createChapterDto.comic_id, updateComicDto);
    //     await this.comicService.findComicByIdAndSetComicPublisher(createChapterDto.comic_id, newChapter.publisher_id);
    //     return chapter;
    // }


    async findChapterById(_id: string): Promise<any> {
        const chapter = await this.chapterRepository.findOneObject({ _id });
        const imageIds = chapter.chapter_content.map((content) => content.image_id);
        const images = await Promise.all(imageIds.map((id) => this.imageService.findImageById(id)));
        const imageUrls = images.map((image) => image.path);
        return { ...new ResponseChapter(chapter, imageUrls) };
    }



    async detailChapter(id: string, uuid: string): Promise<ChapterDocument> {
        const chapter = (await this.findChapterById(id)).chapter;
        const chapterRead = await this.chapterReadService.createChapterRead(uuid, {
            chapter_id: id,
            comic_id: chapter.comic_id,
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


