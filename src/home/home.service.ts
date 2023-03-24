import { Injectable } from '@nestjs/common';
import { ChapterService } from '../full-comics/chapter/chapter.service';
import { CommicService } from '../full-comics/commic/commic.service';
import { CreateHomeData } from './data/create-home.data';
import { CreateHotCommicDto } from './dto/create_hot_commic.dto';
import { CreateNewChapterDto } from './dto/create_new_chapter.dto';
import { HomeRepository } from './repository/home.repository';

@Injectable()
export class HomeService {
    constructor(
        private readonly chapterService: ChapterService, 
        private readonly commicService: CommicService, 
        private readonly homeRepository: HomeRepository,
        ) { }

    async getHomeData(): Promise<Object> {
        let createHotCommics: CreateHotCommicDto[] = [];
        let createNewChapters: CreateNewChapterDto[] = [];
        let newChapters = await this.chapterService.findChapter();
        let hotCommics = await this.commicService.findCommic();
        await this.homeRepository.loopObject(newChapters, CreateNewChapterDto, createNewChapters);
        await this.homeRepository.loopObject(hotCommics, CreateHotCommicDto, createHotCommics); 
        return new CreateHomeData(createHotCommics, createNewChapters);
    }
}
