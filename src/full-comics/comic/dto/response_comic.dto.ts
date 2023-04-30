import { UpdateChaptersComic } from "../../chapter/dto/update-chapters-comic.dto";

export class ResponseComic {
    _id: string;
    image_detail: string;
    image_thumnail_square: string;
    image_thumnail_rectangle: string;
    title: string;
    categories: string[];
    author: string;
    description: string;
    year: string;
    publish_date: string;
    chapters: UpdateChaptersComic[]
    reads: number;
    publisher_id: string;
    update_time: string;
    chapter_update_time: string

    constructor(comic: any, comic1: any) {
        this._id = comic._id;
        this.title = comic.title;
        this.categories = comic.categories;
        this.author = comic.author;
        this.description = comic.description;
        this.year = comic.year;
        this.chapters = comic.chapters;
        this.reads = comic.reads;
        this.image_detail = comic1.image_detail_path;
        this.image_thumnail_square = comic1.image_thumnail_square_path;
        this.image_thumnail_rectangle = comic1.image_thumnail_rectangle_path;
        this.chapter_update_time = comic.chapter_update_time;
        this.update_time = comic.update_time;

    }
}
