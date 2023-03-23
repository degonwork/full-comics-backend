import { Injectable } from '@nestjs/common';
import { ChapterService } from 'src/full-comics/chapter/chapter.service';
import { CommicService } from 'src/full-comics/commic/commic.service';
import { CreateHomeData } from './data/create-home.data';
import { CreateHotCommicDto } from './dto/create_hot_commic.dto';
import { CreateNewChapterDto } from './dto/create_new_chapter.dto';

@Injectable()
export class HomeService {
    constructor(private readonly chapterService: ChapterService, private readonly commicService: CommicService) { }

    async getHomeData(): Promise<Object> {
        let newChapters = await this.chapterService.findChapter();
        let hotCommics = await this.commicService.findCommic();

        const mapNewChapters = newChapters.map((newChapter) => {
            return new CreateNewChapterDto(newChapter.chapter_intro, newChapter.image_id);
        })
        const mapHotCommics = hotCommics.map((hotCommic) => {
            return new CreateHotCommicDto(hotCommic.title, hotCommic.image_id);
        })
        return new CreateHomeData(mapHotCommics, mapNewChapters);
    }
}
