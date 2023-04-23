import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ImageService } from '../../image/image.service';
import { ChapterService } from '../chapter/chapter.service';
import { CategoryService } from '../../category/category.service';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { ResponseComic } from './dto/response_comic.dto';
import { ComicRepository } from './repository/comic.repository';
import { Comic, ComicDocument } from './schema/comic.schema';
import { CreateComicDto } from './dto/create-comic.dto';
import { UpdateComicDto } from './dto/update-comic.dto';

@Injectable()
export class ComicService {
    constructor(
        @Inject(forwardRef(() => ChapterService)) private readonly chapterService: ChapterService,
        private readonly comicRepository: ComicRepository,
        private readonly imageService: ImageService,
        private readonly categoryService: CategoryService,
    ) { }


    async getComicOption(comic: ComicDocument, isDetail: boolean): Promise<any> {
        const comicPath = {
            image_detail_path: (await this.imageService.findImageById(comic.image_detail_id)).path,
            image_thumnail_square_path: (await this.imageService.findImageById(comic.image_thumnail_square_id)).path,
            image_thumnail_rectangle_path: (await this.imageService.findImageById(comic.image_thumnail_rectangle_id)).path
        };
        if (!isDetail) { return new ResponseComic(comic, comicPath); }
        return new ResponseComic(comic, comicPath)

    }


    async createComic(createComicDto: CreateComicDto, image: Express.Multer.File, image_thumnail_square: Express.Multer.File, image_thumnail_rectangle: Express.Multer.File): Promise<ComicDocument> {
        // createComicDto.reads = 0;
        const newComic = Object.assign(createComicDto);
        const imageDetail = await this.imageService.createComicImageFile(createComicDto.image_detail, image);
        newComic.image_detail_id = imageDetail[0].id;
        const imageThumnailSquareObject = await this.imageService.createComicImageFile(createComicDto.image_thumnail_square, image_thumnail_square);
        newComic.image_thumnail_square_id = imageThumnailSquareObject[0].id;
        const imageThumnailRectangleObject = await this.imageService.createComicImageFile(createComicDto.image_thumnail_rectangle, image_thumnail_rectangle);
        newComic.image_thumnail_rectangle_id = imageThumnailRectangleObject[0].id;
        newComic.categories_name = [];
        for (const categoryName of createComicDto.categories) {
            const category = await this.categoryService.findCategory(categoryName);
            if (!category) {
                const category = (await this.categoryService.createCategory(new CreateCategoryDto(categoryName)));
                newComic.categories_name.push(category.name);
            } else {
                newComic.categories_name.push(category.name);
            }
        }
        return await this.comicRepository.createObject(newComic);
    }

    async findComicById(_id: string): Promise<any> {
        const comic = await this.comicRepository.findOneObject({ _id });
        return await this.getComicOption(comic, false);
    }

    async findComicByIdAndUpdate(_id: string, updateComicDto: UpdateComicDto): Promise<Comic> {
        return this.comicRepository.findOneObjectAndUpdate({ _id }, updateComicDto);
    }
    async findComicByIdAndSetComicPublisher(_id: string, publisher_id: string): Promise<any> {
        const comic = await this.comicRepository.findOneObject({ _id })
        if (!comic.publisher_id) {
            comic.publisher_id = publisher_id
            return await this.comicRepository.findOneObjectAndUpdate({ _id }, comic)
        }
        return comic;

    }

    async findHotComic(limit?: number): Promise<any> {
        const hotComics = await this.comicRepository.findObject(limit);
        let responeHotComics = <any>[];
        hotComics.sort((a, b) => { return b.reads - a.reads; });
        for (const hotComic of hotComics) {
            const responseHotComic = await this.getComicOption(hotComic, true);
            responeHotComics.push(responseHotComic);
        }
        return responeHotComics;
    }

    async findNewComic(limit?: number): Promise<any> {
        const newComics = await this.comicRepository.findObject(limit);
        let responeNewComics = <any>[];
        newComics.sort((a, b) => {
            return this._toTimeStamp(b.new_update_time) - this._toTimeStamp(a.new_update_time);
        });
        for (const newComic of newComics) {
            const responeNewComic = await this.getComicOption(newComic, true);
            responeNewComics.push(responeNewComic);
        }
        return responeNewComics;
    }

    _toTimeStamp(strDate: string): number {
        let datum = Date.parse(strDate);
        return datum / 1000;
    }
}
