import { ChapterDocument } from "../schema/chapter.schema";

export class ResponseChapter {
    constructor(public readonly chapter: ChapterDocument, public readonly image: string[]) { }
}