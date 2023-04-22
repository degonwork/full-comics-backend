import { UpdateChaptersCommic } from "src/full-comics/chapter/dto/update-chapters-commic.dto";

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
    chapters: UpdateChaptersCommic[]
    reads: number;
    publisher_id: string;
    new_update_time: string;

    constructor(comic: any, comic1: any) {
        this._id = comic._id;
        this.title = comic.title;
        this.categories = comic.categories;
        this.author = comic.author;
        this.description = comic.description;
        this.year = comic.year;
        this.chapters = comic.chapters;
        this.reads = comic.reads;
        this.new_update_time = comic.new_update_time;
        this.image_detail = comic1.image_detail_path;
        this.image_thumnail_square = comic1.image_thumnail_square_path;
        this.image_thumnail_rectangle = comic1.image_thumnail_rectangle_path;
    }
}
