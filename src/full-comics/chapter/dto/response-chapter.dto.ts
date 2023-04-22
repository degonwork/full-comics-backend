
export class ResponseChapter {
    _id: string;
    commic_id: string;
    // publisher_id: string;
    content: string[];
    // chapter_des: string;
    publish_date: string;

    constructor(chapter: any, imageUrls: string[]) {
        this._id = chapter._id;
        this.commic_id = chapter.commic_id;
        // this.publisher_id = chapter.publisher_id;
        // this.chapter_des = chapter.chapter_des;
        this.publish_date = chapter.publish_date;
        this.content = imageUrls;
    }
}