import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model} from 'mongoose';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ChapterRepository } from './repository/chapter.repository';
import { Chapter, ChapterDocument } from './schema/chapter.schema';

@Injectable()
export class ChapterService {
    constructor(
        private chapterRepository: ChapterRepository
        ) {}
     
    async createChapter(createChapterDto: CreateChapterDto): Promise<Chapter> {
        return await this.chapterRepository.createObject(createChapterDto);
       
    }

    async findChapter() : Promise<Chapter[]> {
        return this.chapterRepository.findObject();
    }
}
    

