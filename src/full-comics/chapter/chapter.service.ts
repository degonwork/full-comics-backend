import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ImageService } from 'src/image/image.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Chapter, ChapterDocument } from './schema/chapter.schema';

@Injectable()
export class ChapterService {
    constructor(@InjectModel(Chapter.name) private readonly chapterModel: mongoose.Model<ChapterDocument>, private readonly imageService: ImageService) {}
     
    async createChapter(createChapterDto: CreateChapterDto): Promise<Chapter> {
        const image = createChapterDto.image;
        const imageId = (await this.imageService.createImage(image))._id;
        const newChapter = Object.assign(createChapterDto);
        newChapter.image_id = imageId;
        return await this.chapterModel.create(newChapter);
    }

    async findChapter() : Promise<Chapter[]> {
        return this.chapterModel.find().exec();
    }
}
    

