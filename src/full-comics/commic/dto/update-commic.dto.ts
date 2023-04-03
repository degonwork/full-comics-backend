export class UpdateCommicDto {
    constructor(public chapters: string[], public readonly reads: number, public new_update_time?: string) { }
}