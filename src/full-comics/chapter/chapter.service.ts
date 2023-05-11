import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ChapterReadService } from '../../chapter-read/chapter-read.service';
import { ImageService } from '../../image/image.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ResponseChapter } from './dto/response-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ChapterRepository } from './repository/chapter.repository';
import { Chapter, ChapterDocument } from './schema/chapter.schema';
import { ImageDocument, TypeImage } from '../../image/schema/image.schema';
import { CreateChapterContentDto } from './dto/create-chapter-content.dto';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { ComicService } from '../comic/comic.service';
import { UpdateComicDto } from '../comic/dto/update-comic.dto';
import { UpdateChaptersComic } from './dto/update-chapters-comic.dto';
import { response } from 'express';
import { async } from 'rxjs';
import { ComicRepository } from '../comic/repository/comic.repository';

@Injectable()
export class ChapterService {
    constructor(
        @Inject(forwardRef(() => ComicService))
        private readonly comicService: ComicService,
        private readonly chapterRepository: ChapterRepository,
        private readonly chapterReadService: ChapterReadService,
        private readonly imageService: ImageService,
        private readonly comicRepository: ComicRepository,


    ) { }


    // Tạo chapter = upload file
    async createChapterFile(createChapterDto: CreateChapterDto, reqUser: any, imageThumnail: Express.Multer.File, imageContents: Express.Multer.File[]): Promise<ChapterDocument> {
        let updateComicDto = new UpdateComicDto([]);
        let listCreateChapterContent: CreateChapterContentDto[] = []
        // Tạo thumnail
        if (imageThumnail) {
            const imageThumnailNew = new CreateImageDto
            imageThumnailNew.type = TypeImage.CHAPTER
            const imageChapterThumnail = await this.imageService.createComicImageFile(imageThumnailNew, imageThumnail)
            createChapterDto.image_thumnail = imageChapterThumnail;
        }
        // Tạo content 
        for (const imageContent of imageContents) {
            const imageFileChapterContent = await this.imageService.createImageFile(new CreateChapterContentDto('', '', TypeImage.CONTENT), imageContent);
            const createChapterContent = new CreateChapterContentDto(imageFileChapterContent.id, imageFileChapterContent.path, imageFileChapterContent.type);
            listCreateChapterContent.push(createChapterContent);
        }
        createChapterDto.chapter_content = listCreateChapterContent;
        createChapterDto.publish_date = new Date().toLocaleString('en-GB', { hour12: false });

        //Tao publisher_id
        createChapterDto.publisher_id = reqUser.id;
        const chapter = await this.chapterRepository.createObject(createChapterDto);
        const updateChaptersComic = new UpdateChaptersComic(chapter.id, chapter.chapter_des, chapter.image_thumnail.path);
        updateComicDto.chapters = (await this.comicService.findComicById(createChapterDto.comic_id)).chapters;
        updateComicDto.chapters.push(updateChaptersComic);
        updateComicDto.add_chapter_time = chapter.publish_date;
        updateComicDto.update_time = new Date().toLocaleString('en-GB', { hour12: false });
        // const { title, categories, description, reads, ...update } = updateComicDto;
        await this.comicService.findComicByIdAndUpdate(createChapterDto.comic_id, updateComicDto);
        await this.comicService.findComicByIdAndSetComicPublisher(createChapterDto.comic_id, createChapterDto.publisher_id);
        return chapter;
    }

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

    async updateAddImagesContent(chapterId: string, images_content: Express.Multer.File[]): Promise<ChapterDocument> {
        const chapter = await this.chapterRepository.findOneObject({ _id: chapterId });
        if (!chapter) {
            throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
        }
        for (const image_content of images_content) {
            const imageFileChapterContentUpdate = await this.imageService.createImageFile(
                new CreateChapterContentDto('', '', TypeImage.CONTENT), image_content);
            const createChapterContent = new CreateChapterContentDto(
                imageFileChapterContentUpdate.id,
                imageFileChapterContentUpdate.path,
                imageFileChapterContentUpdate.type
            );
            chapter.chapter_content.push(createChapterContent);
        }
        chapter.content_update_time = new Date().toLocaleString('en-GB', { hour12: false });
        chapter.update_time = new Date().toLocaleString('en-GB', { hour12: false });
        const chapterUpdated = await chapter.save();
        return chapterUpdated;
    }

    async updateChapterContent(chapterId: string, chapter_content: CreateChapterContentDto[]): Promise<{ message: string }> {
        const chapter = await this.chapterRepository.findOneObject({ _id: chapterId });
        if (!chapter) {
            throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
        }
        chapter.chapter_content = chapter_content;
        chapter.content_update_time = new Date().toLocaleString('en-GB', { hour12: false });
        console.log(chapter.content_update_time);

        chapter.update_time = new Date().toLocaleString('en-GB', { hour12: false });
        await chapter.save();
        return { message: 'Chapter updated successfully' };
    }


    async updateChapterDes(chapterId: string, chapter_des: string): Promise<{ message: string }> {
        const chapter = await this.chapterRepository.findOneObject({ _id: chapterId });
        if (!chapter) {
            throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
        }
        chapter.chapter_des = chapter_des;
        chapter.update_time = new Date().toLocaleString('en-GB', { hour12: false });
        await chapter.save();
        const comicUpdate = await this.comicRepository.findOneObject({ _id: chapter.comic_id })
        for (const chapters of comicUpdate.chapters) {
            if (chapters.chapter_id === chapter.id) {
                chapters.chapter_des = chapter.chapter_des
                break;
            }
        }
        comicUpdate.chapter_update_time = chapter.update_time
        comicUpdate.update_time = chapter.update_time
        await this.comicRepository.findOneObjectAndUpdate(comicUpdate.id, comicUpdate);
        return { message: 'Chapter des updated successfully' };
    }

    async updateChapterImageThumnail(chapterId: string, images_content: Express.Multer.File): Promise<{ message: string }> {
        const chapter = await this.chapterRepository.findOneObject({ _id: chapterId });
        if (!chapter) {
            throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
        }
        const imageThumnailUpdate = await this.imageService.createImageFile(new CreateChapterContentDto('', '', TypeImage.CHAPTER), images_content);
        chapter.image_thumnail = imageThumnailUpdate;
        chapter.update_time = new Date().toLocaleString('en-GB', { hour12: false });
        await chapter.save();
        const comicUpdate = await this.comicRepository.findOneObject({ _id: chapter.comic_id })
        for (const chapters of comicUpdate.chapters) {
            if (chapters.chapter_id === chapter.id) {
                chapters.image_thumnail = chapter.image_thumnail.path
                break;
            }
        }
        comicUpdate.chapter_update_time = chapter.update_time
        comicUpdate.update_time = chapter.update_time
        await this.comicRepository.findOneObjectAndUpdate(comicUpdate.id, comicUpdate);
        return { message: 'Image thumnail updated successfully' };
    }
}


