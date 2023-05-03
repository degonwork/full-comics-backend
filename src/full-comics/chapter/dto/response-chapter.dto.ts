export class ResponseChapter {
    _id: string;
    comic_id: string;
    image_thumnail: string;
    // publisher_id: string;
    content: string[];
    chapter_des: string;
    publish_date: string;
    content_update_time: number;
    update_time: number


    constructor(chapter: any, imageUrls: string[]) {
        this._id = chapter._id;
        this.comic_id = chapter.comic_id;
        this.image_thumnail = chapter.image_thumnail.path;
        // this.publisher_id = chapter.publisher_id;
        this.chapter_des = chapter.chapter_des;
        this.publish_date = chapter.publish_date;
        this.content = imageUrls;
        const ContentUpdateTimestamp = new Date(chapter.content_update_time).getTime();
        this.content_update_time = ContentUpdateTimestamp
        const updateTimestamp = new Date(chapter.update_time).getTime();
        this.update_time = updateTimestamp
    }
}   