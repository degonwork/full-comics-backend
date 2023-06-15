import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateChaptersComic } from '../../chapter/dto/update-chapters-comic.dto';

export class UpdateComicDto {
  updateComicDto: UpdateChaptersComic;
  constructor(
    public chapters?: UpdateChaptersComic[],
    public title?: string,
    public categories?: string[],
    public description?: string,
    public update_time?: string,
    public reads?: number,
    public chapter_update_time?: string,
    public add_chapter_time?: string,
  ) {}
}
