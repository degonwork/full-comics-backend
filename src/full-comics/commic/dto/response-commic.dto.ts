import { CommicDocument } from "../schema/commic.schema";

export class ResponseCommic {
    constructor(
        public readonly commic: CommicDocument,
        public readonly listImage: {
            image_detail: string,
            image_thumnail_square: string,
            image_thumnail_rectangle: string
        }
    ) { }
}