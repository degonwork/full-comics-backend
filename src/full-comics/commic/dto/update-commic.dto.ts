import { UpdateChaptersCommic } from "src/full-comics/chapter/dto/update-chapters-commic.dto";

export class UpdateCommicDto {
    constructor(public chapters: UpdateChaptersCommic[], public new_update_time?: string, public readonly reads?: number) { }
}