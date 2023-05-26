import * as moment from 'moment';
import { ImageResponse } from 'src/image/dto/image-response.dto';

export class ResponseChapter {
  _id: string;
  comic_id: string;
  image_thumnail: ImageResponse;
  // publisher_id: string;
  content: ImageResponse[];
  chapter_des: string;
  publish_date: number;
  content_update_time: number;
  update_time: number;

  constructor(chapter: any, imageContent: any[]) {
    this._id = chapter._id;
    this.comic_id = chapter.comic_id;
    this.image_thumnail = {
      id: chapter.image_thumnail._id,
      path: chapter.image_thumnail.path,
    };
    // this.publisher_id = chapter.publisher_id;
    this.content = imageContent.map((content) => ({
      id: content._id,
      path: content.path,
    }));
    this.chapter_des = chapter.chapter_des;
    this.publish_date = moment(
      chapter.publish_date,
      'DD/MM/YYYY, hh:mm:ss',
    ).valueOf();
    this.content_update_time = moment(
      chapter.content_update_time,
      'DD/MM/YYYY, hh:mm:ss',
    ).valueOf();
    this.update_time = moment(
      chapter.update_time,
      'DD/MM/YYYY, hh:mm:ss',
    ).valueOf();
  }
}
