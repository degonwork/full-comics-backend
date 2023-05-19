import { UpdateChaptersComic } from "../../chapter/dto/update-chapters-comic.dto";
import * as moment from 'moment';

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
    chapters: UpdateChaptersComic[];
    reads: number;
    publisher_id: string;
    update_time: number;
    chapter_update_time: number;
    add_chapter_time: number;

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
        this.chapter_update_time = moment(comic.chapter_update_time, 'DD/MM/YYYY, hh:mm:ss').valueOf();
        this.update_time = moment(comic.update_time, 'DD/MM/YYYY, hh:mm:ss').valueOf();
        this.add_chapter_time = moment(comic.add_chapter_time, 'DD/MM/YYYY, hh:mm:ss').valueOf();
    }
}
