import { ImageResponse } from "src/image/dto/image-response.dto";

export class UpdateChaptersComic {
  constructor(
    public readonly chapter_id?: string,
    public chapter_des?: string,
    public image_thumnail?: ImageResponse,
  ) {}
}
