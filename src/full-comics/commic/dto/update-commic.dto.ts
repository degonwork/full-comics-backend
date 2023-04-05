export class UpdateCommicDto {
    constructor(public chapters: string[], public new_update_time?: string, public readonly reads?: number) { }
}