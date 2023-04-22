import { UpdateChaptersCommic } from "src/full-comics/chapter/dto/update-chapters-commic.dto";

export class UpdateCommicDto {
    updateCommicDto: UpdateChaptersCommic;
    constructor(
        public chapters: UpdateChaptersCommic[],
        public new_update_time?: string,
        public readonly reads?: number,
    ) {

    }
}