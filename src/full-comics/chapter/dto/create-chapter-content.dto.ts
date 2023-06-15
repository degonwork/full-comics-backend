import { TypeImage } from "src/image/schema/image.schema";

export class CreateChapterContentDto {
    static CONTENT: TypeImage;
    constructor(
        public image_id: string,
        public path: string,
        public type: TypeImage,
    ) { }
}