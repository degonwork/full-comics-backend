import { TypeImage } from "src/image/schema/image.schema";

export class CreateChapterContentDto {
    static CHAPTER: TypeImage;
    constructor(
        public image_id: string,
        public path: string,
        public type: TypeImage,
    ) { }
}