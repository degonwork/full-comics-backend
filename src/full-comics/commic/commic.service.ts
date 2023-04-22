import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Commic, CommicDocument } from './schema/commic.schema';
import { CreateCommicDto } from './dto/create-commic.dto';
import { CommicRepository } from './repository/commic.repository';
import { UpdateCommicDto } from './dto/update-commic.dto';
import { ImageService } from '../../image/image.service';
import { ChapterService } from '../chapter/chapter.service';
import { CategoryService } from '../../category/category.service';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { ResponseComic } from './dto/response_comic.dto';

@Injectable()
export class CommicService {
    constructor(
        @Inject(forwardRef(() => ChapterService)) private readonly chapterService: ChapterService,
        private readonly commicRepository: CommicRepository,
        private readonly imageService: ImageService,
        private readonly categoryService: CategoryService,
    ) { }


    async getCommicOption(commic: CommicDocument, isDetail: boolean): Promise<any> {

        const comicPath = {
            image_detail_path: (await this.imageService.findImageById(commic.image_detail_id)).path,
            image_thumnail_square_path: (await this.imageService.findImageById(commic.image_thumnail_square_id)).path,
            image_thumnail_rectangle_path: (await this.imageService.findImageById(commic.image_thumnail_rectangle_id)).path
        };

        if (!isDetail) { return new ResponseComic(commic, comicPath); }

        return new ResponseComic(commic, comicPath)

    }


    async createCommic(createCommicDto: CreateCommicDto, image: Express.Multer.File, image_thumnail_square: Express.Multer.File, image_thumnail_rectangle: Express.Multer.File): Promise<CommicDocument> {
        // createCommicDto.reads = 0;

        const newCommic = Object.assign(createCommicDto);
        const imageDetail = await this.imageService.createComicImageFile(createCommicDto.image_detail, image);
        newCommic.image_detail_id = imageDetail[0].id;
        const imageThumnailSquareObject = await this.imageService.createComicImageFile(createCommicDto.image_thumnail_square, image_thumnail_square);
        newCommic.image_thumnail_square_id = imageThumnailSquareObject[0].id;
        const imageThumnailRectangleObject = await this.imageService.createComicImageFile(createCommicDto.image_thumnail_rectangle, image_thumnail_rectangle);
        newCommic.image_thumnail_rectangle_id = imageThumnailRectangleObject[0].id;
        newCommic.categories_name = [];

        for (const categoryName of createCommicDto.categories) {

            const category = await this.categoryService.findCategory(categoryName);

            if (!category) {
                const category = (await this.categoryService.createCategory(new CreateCategoryDto(categoryName)));
                newCommic.categories_name.push(category.name);
            } else {
                newCommic.categories_name.push(category.name);
            }

        }

        return await this.commicRepository.createObject(newCommic);
    }

    async findCommicById(_id: string): Promise<any> {
        const commic = await this.commicRepository.findOneObject({ _id });
        return await this.getCommicOption(commic, false);
    }

    async findCommicByIdAndUpdate(_id: string, updateCommicDto: UpdateCommicDto): Promise<Commic> {
        return this.commicRepository.findOneObjectAndUpdate({ _id }, updateCommicDto);
    }
    async findCommicByIdAndSetComicPublisher(_id: string, publisher_id: string): Promise<any> {
        const commic = await this.commicRepository.findOneObject({ _id })
        if (!commic.publisher_id) {
            commic.publisher_id = publisher_id
            return await this.commicRepository.findOneObjectAndUpdate({ _id }, commic)
        }
        return commic;

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
