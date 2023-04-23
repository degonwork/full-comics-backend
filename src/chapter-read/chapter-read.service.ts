import { Injectable } from '@nestjs/common';
import { ComicService } from '../full-comics/comic/comic.service';
import { UpdateComicDto } from '../full-comics/comic/dto/update-comic.dto';
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
        private readonly comicService: ComicService,
    ) { }

    async createChapterRead(uuid: string, createChapterReadDto: CreateChapterReadDto): Promise<ChapterRead | null> {
        console.log("---------------------------------------");
        const { chapter_id, comic_id } = createChapterReadDto;
        const userExisted = await this.userService.findbyUUID(uuid);
        if (!userExisted) {
            console.log('user is not existing');
            const user = await this.userService.createUUIDUser(new CreateUUIDUserDto(uuid));
            const comic = (await this.comicService.findComicById(comic_id)).comic;
            comic.reads += 1;
            await this.comicService.findComicByIdAndUpdate(comic._id, new UpdateComicDto(comic.chapters, comic.new_update_time, comic.reads));
            createChapterReadDto.user_id = user._id;
            createChapterReadDto.state = 'reading'
            return this.chapterReadRepository.createObject(createChapterReadDto);
        } else {
            console.log('user is existing');
            createChapterReadDto.user_id = userExisted._id;
            const comicExisted = await this.getChapterReadByComicIDWithUserID(userExisted._id, comic_id);
            if (!comicExisted) {
                console.log('comic is not existing');
                const comic = (await this.comicService.findComicById(comic_id)).comic;
                comic.reads += 1;
                await this.comicService.findComicByIdAndUpdate(comic._id, new UpdateComicDto(comic.chapters, comic.new_update_time, comic.reads));
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

    async getChapterReadByComicIDWithUserID(user_id, comic_id: string): Promise<ChapterRead> {
        return this.chapterReadRepository.findOneObject({ user_id, comic_id });
    }
}
