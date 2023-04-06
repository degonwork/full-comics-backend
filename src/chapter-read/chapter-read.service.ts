import { Injectable } from '@nestjs/common';
import { CommicService } from '../full-comics/commic/commic.service';
import { UpdateCommicDto } from '../full-comics/commic/dto/update-commic.dto';
import { CreateUUIDUserDto } from '../user/dto/create-uuid-user.dto';
import { UserService } from '../user/user.service';
import { CreateChapterReadDto } from './dto/create-chapter-read.dto';
import { ChapterReadRepository } from './repository/chapter-read.repository';
import { ChapterRead } from './schema/chapter-read.schema';

@Injectable()
export class ChapterReadService {
    constructor(
        private readonly chapterReadRepository: ChapterReadRepository,
        private readonly userService: UserService,
        private readonly commicService: CommicService,
    ) { }

    async createChapterRead(uuid: string, createChapterReadDto: CreateChapterReadDto): Promise<ChapterRead | null> {
        console.log("---------------------------------------");
        const { chapter_id, commic_id } = createChapterReadDto;
        const userExisted = await this.userService.findbyUUID(uuid);
        if (!userExisted) {
            console.log('user is not existing');
            const user = await this.userService.createUUIDUser(new CreateUUIDUserDto(uuid));
            const commic = (await this.commicService.findCommicById(commic_id)).commic;
            commic.reads += 1;
            await this.commicService.findCommicByIdAndUpdate(commic._id, new UpdateCommicDto(commic.chapters, commic.new_update_time, commic.reads));
            createChapterReadDto.user_id = user._id;
            createChapterReadDto.state = 'reading'
            return this.chapterReadRepository.createObject(createChapterReadDto);
        } else {
            console.log('user is existing');
            createChapterReadDto.user_id = userExisted._id;
            const commicExisted = await this.getChapterReadByCommicIDWithUserID(userExisted._id, commic_id);
            if (!commicExisted) {
                console.log('commic is not existing');
                const commic = (await this.commicService.findCommicById(commic_id)).commic;
                commic.reads += 1;
                await this.commicService.findCommicByIdAndUpdate(commic._id, new UpdateCommicDto(commic.chapters, commic.new_update_time, commic.reads));
                createChapterReadDto.state = 'reading';
                return this.chapterReadRepository.createObject(createChapterReadDto);
            }
            const chapterIsExited = await this.getChapterReadByChapterIDWithUserID(userExisted._id, chapter_id);
            if (!chapterIsExited) {
                console.log('chapter is not existing');
                createChapterReadDto.state = 'reading'
                return this.chapterReadRepository.createObject(createChapterReadDto);
            }
        }
        return null;
    }

    async getChapterReadByChapterIDWithUserID(user_id: string, chapter_id: string): Promise<ChapterRead> {
        return this.chapterReadRepository.findOneObject({ user_id, chapter_id });
    }

    async getChapterReadByCommicIDWithUserID(user_id, commic_id: string): Promise<ChapterRead> {
        return this.chapterReadRepository.findOneObject({ user_id, commic_id });
    }
}
