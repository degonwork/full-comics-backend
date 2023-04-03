import { CommicDocument } from "../schema/commic.schema";

export class ResponseCommic {
    constructor(public readonly commic: CommicDocument, public readonly image: string) {}
}