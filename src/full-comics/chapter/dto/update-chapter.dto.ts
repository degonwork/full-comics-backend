
export class UpdateChapterDto {
  constructor(
    public chapter_des?: string,
    public chapter_number?: number,
    public content_update_time?: string,
    public update_time?: string,
  ) {}
}
