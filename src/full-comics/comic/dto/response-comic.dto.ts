import { UpdateChaptersComic } from "../../chapter/dto/update-chapters-comic.dto";

export class ResponseComic {
    _id: string;
    image_detail_path: string;
    image_thumnail_square_path: string;
    image_thumnail_rectangle_path: string;
    title: string;
    categories: string[];
    author: string;
    description: string;
    year: string;
    publish_date: string;
    chapters: UpdateChaptersComic[]
    reads: number;
    publisher_id: string;
    update_time: number;
    chapter_update_time: number;
    add_chapter_time: number

    constructor(comic: any, comic1: any) {
        this._id = comic._id;
        this.title = comic.title;
        this.categories = comic.categories;
        this.author = comic.author;
        this.description = comic.description;
        this.year = comic.year;
        this.chapters = comic.chapters;
        this.reads = comic.reads;
        this.image_detail_path = comic1.image_detail_path;
        this.image_thumnail_square_path = comic1.image_thumnail_square_path;
        this.image_thumnail_rectangle_path = comic1.image_thumnail_rectangle_path;
        const chapterUpdateTimestamp = comic.chapter_update_time != null ? new Date(comic.chapter_update_time).getTime() : null;
        this.chapter_update_time = chapterUpdateTimestamp;
        const updateTimestamp = comic.update_time != null ? new Date(comic.update_time).getTime() : null;
        this.update_time = updateTimestamp
        const addChapterTimestamp = comic.add_chapter_time != null ? new Date(comic.add_chapter_time).getTime() : null;
        this.add_chapter_time = addChapterTimestamp
    }
}
