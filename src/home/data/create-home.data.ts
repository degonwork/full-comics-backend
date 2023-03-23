import { CreateHotCommicDto } from "../dto/create_hot_commic.dto";
import { CreateNewChapterDto } from "../dto/create_new_chapter.dto";

export class CreateHomeData {
    constructor(public readonly hot_commic: CreateHotCommicDto[], public readonly new_chapter: CreateNewChapterDto[]) { }
}