import { UpdateChaptersComic } from "../../chapter/dto/update-chapters-comic.dto";

export class UpdateComicDto {
    updateComicDto: UpdateChaptersComic;
    constructor(
        public chapters: UpdateChaptersComic[],
        public new_update_time?: string,
        public readonly reads?: number,
    ) {
    }
}