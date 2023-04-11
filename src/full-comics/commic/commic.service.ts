import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Commic, CommicDocument } from './schema/commic.schema';
import { CreateCommicDto } from './dto/create-commic.dto';
import { CommicRepository } from './repository/commic.repository';
import { UpdateCommicDto } from './dto/update-commic.dto';
import { ImageService } from '../../image/image.service';
import { ResponseCommic } from './dto/response-commic.dto';
import { ChapterService } from '../chapter/chapter.service';
import { CategoryService } from '../../category/category.service';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';

@Injectable()
export class CommicService {
    constructor(
        @Inject(forwardRef(() => ChapterService)) private readonly chapterService: ChapterService,
        private readonly commicRepository: CommicRepository,
        private readonly imageService: ImageService,
        private readonly categoryService: CategoryService,
    ) { }

    async getCommicOption(commic: CommicDocument, isDetail: boolean): Promise<any> {
        const image = {
            image_detail: (await this.imageService.findImageById(commic.image_detail_id)).path,
            image_thumnail_square: (await this.imageService.findImageById(commic.image_thumnail_square_id)).path,
            image_thumnail_rectangle: (await this.imageService.findImageById(commic.image_thumnail_rectangle_id)).path
        };
        if (!isDetail) { return new ResponseCommic(commic, image); }
        return {
            id: commic._id,
            title: commic.title,
            image: image,
        }
    }

    async createCommic(createCommicDto: CreateCommicDto): Promise<CommicDocument> {
        // createCommicDto.reads = 0;
        const newCommic = Object.assign(createCommicDto);
        const imageDetailId = await this.commicRepository.createImage(createCommicDto.image_detail);
        newCommic.image_detail_id = imageDetailId;
        const imageThumnailSquareObjectId = await this.commicRepository.createImage(createCommicDto.image_thumnail_square);
        newCommic.image_thumnail_square_id = imageThumnailSquareObjectId;
        const imageThumnailRectangleObjectId = await this.commicRepository.createImage(createCommicDto.image_thumnail_rectangle);
        newCommic.image_thumnail_rectangle_id = imageThumnailRectangleObjectId;
        newCommic.categories_id = [];
        for (const category of createCommicDto.categories) {
            const categoryId = (await this.categoryService.createCategory(new CreateCategoryDto(category)))._id;
            newCommic.categories_id.push(categoryId);
        }
        return await this.commicRepository.createObject(newCommic);
    }

    async findCommicById(_id: string): Promise<any> {
        const commic = await this.commicRepository.findOneObject({ _id });
        return this.getCommicOption(commic, false);
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
