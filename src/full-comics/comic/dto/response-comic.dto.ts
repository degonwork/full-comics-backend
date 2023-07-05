import { ImageResponse } from 'src/image/dto/image-response.dto';
import * as moment from 'moment';
import { ResponseChapterInComic } from 'src/full-comics/chapter/dto/response-chapter-in-comic.dto';

export class ResponseComic {
  _id: string;
  image_detail: ImageResponse;
  image_thumnail_square: ImageResponse;
  image_thumnail_rectangle: ImageResponse;
  title: string;
  categories: string[];
  author: string;
  description: string;
  year: string;
  chapters: ResponseChapterInComic[];
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
    this.image_detail = comic1.image_detail;
    this.image_thumnail_square = comic1.image_thumnail_square;
    this.image_thumnail_rectangle = comic1.image_thumnail_rectangle;
    this.chapter_update_time = moment(
      comic.chapter_update_time,
      'DD/MM/YYYY, hh:mm:ss',
    ).valueOf();
    this.update_time = moment(
      comic.update_time,
      'DD/MM/YYYY, hh:mm:ss',
    ).valueOf();
    this.add_chapter_time = moment(
      comic.add_chapter_time,
      'DD/MM/YYYY, hh:mm:ss',
    ).valueOf();
    this.chapters.forEach((chapter: ResponseChapterInComic, index: number) => {
      chapter.chapter_index = index + 1;
    });
  }
}
