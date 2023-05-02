export class ResponseChapter {
    _id: string;
    comic_id: string;
    image_thumnail: string;
    // publisher_id: string;
    content: string[];
    chapter_des: string;
    publish_date: string;
    content_update_time: string;
    update_time: string


    constructor(chapter: any, imageUrls: string[]) {
        this._id = chapter._id;
        this.comic_id = chapter.comic_id;
        this.image_thumnail = chapter.image_thumnail.path;
        // this.publisher_id = chapter.publisher_id;
        this.chapter_des = chapter.chapter_des;
        this.publish_date = chapter.publish_date;
        this.content = imageUrls;
        this.content_update_time = chapter.content_update_time
        this.update_time = chapter.update_time
    }
}   