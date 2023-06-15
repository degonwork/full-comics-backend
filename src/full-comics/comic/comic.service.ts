import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ImageService } from '../../image/image.service';
import { ChapterService } from '../chapter/chapter.service';
import { CategoryService } from '../../category/category.service';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { ResponseComic } from './dto/response-comic.dto';
import { ComicRepository } from './repository/comic.repository';
import { Comic, ComicDocument } from './schema/comic.schema';
import { CreateComicDto } from './dto/create-comic.dto';
import { UpdateComicDto } from './dto/update-comic.dto';
import { ResponsePublisherComic } from './dto/response-publisher-comics.dto';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { TypeImage } from 'src/image/schema/image.schema';
import * as moment from 'moment';
import { ImageResponse } from 'src/image/dto/image-response.dto';
@Injectable()
export class ComicService {
  constructor(
    @Inject(forwardRef(() => ChapterService))
    private readonly chapterService: ChapterService,
    private readonly comicRepository: ComicRepository,
    private readonly imageService: ImageService,
    private readonly categoryService: CategoryService,
  ) { }
  async getComicOption(comic: ComicDocument, isDetail: boolean): Promise<any> {
    const comicPath: { [key: string]: ImageResponse } = {
      image_detail: {
        id: comic.image_detail_id,
        path: (await this.imageService.findImageById(comic.image_detail_id))
          .path,
      },
      image_thumnail_square: {
        id: comic.image_thumnail_square_id,
        path: (
          await this.imageService.findImageById(comic.image_thumnail_square_id)
        ).path,
      },
      image_thumnail_rectangle: {
        id: comic.image_thumnail_rectangle_id,
        path: (
          await this.imageService.findImageById(
            comic.image_thumnail_rectangle_id,
          )
        ).path,
      },
    };

    if (isDetail) {
      const ComicResponse = new ResponseComic(comic, comicPath);
      return ComicResponse;
    }
    const addChapterTimestamp = this._toTimeStamp(comic.add_chapter_time);
    const updateTimestamp = this._toTimeStamp(comic.update_time);
    return {
      id: comic._id,
      title: comic.title,
      ...comicPath,
      reads: comic.reads,
      add_chapter_time: addChapterTimestamp,
      update_time: updateTimestamp,
      times_ads: 5,
    };
  }

  async createComic(
    createComicDto: CreateComicDto,
    image_detail: Express.Multer.File,
    image_thumnail_square: Express.Multer.File,
    image_thumnail_rectangle: Express.Multer.File,
  ): Promise<ComicDocument> {
    // createComicDto.reads = 0;
    const newComic = Object.assign(createComicDto);
    const imageNew = new CreateImageDto();
    imageNew.type = TypeImage.COMIC;
    if (image_detail) {
      const imageDetail = await this.imageService.createComicImageFile(
        imageNew,
        image_detail,
      );
      newComic.image_detail_id = imageDetail.id;
    }
    if (image_thumnail_square) {
      const imageThumnailSquareObject =
        await this.imageService.createComicImageFile(
          imageNew,
          image_thumnail_square,
        );
      newComic.image_thumnail_square_id = imageThumnailSquareObject.id;
    }
    if (image_thumnail_rectangle) {
      const imageThumnailRectangleObject =
        await this.imageService.createComicImageFile(
          imageNew,
          image_thumnail_rectangle,
        );
      newComic.image_thumnail_rectangle_id = imageThumnailRectangleObject.id;
    }
    newComic.categories_name = [];
    for (const categoryName of createComicDto.categories) {
      const category = await this.categoryService.findCategory(categoryName);
      if (!category) {
        const category = await this.categoryService.createCategory(
          new CreateCategoryDto(categoryName),
        );
        newComic.categories_name.push(category.name);
      } else {
        newComic.categories_name.push(category.name);
      }
    }
    return await this.comicRepository.createObject(newComic);
  }

  async findComicById(_id: string): Promise<any> {
    const comic = await this.comicRepository.findOneObject({ _id });
    return await this.getComicOption(comic, true);
  }

  // all publisher comics
  async findComicByPublisherId(
    publisher_id: string,
  ): Promise<ResponsePublisherComic[]> {
    const publisherComics: ResponsePublisherComic[] = [];
    const comics = await this.comicRepository.findObjectsBy(
      'publisher_id',
      publisher_id,
    );
    for (const comic of comics) {
      const image_detail = await this.imageService.findImageById(
        comic.image_detail_id,
      );
      const image_thumnail_square = await this.imageService.findImageById(
        comic.image_thumnail_square_id,
      );
      const image_thumnail_rectangle = await this.imageService.findImageById(
        comic.image_thumnail_rectangle_id,
      );
      const responseComic = new ResponsePublisherComic(
        comic,
        image_detail.path,
        image_thumnail_square.path,
        image_thumnail_rectangle.path,
      );
      publisherComics.push(responseComic);
    }
    return publisherComics;
  }

  async findComicByIdAndUpdate(
    _id: string,
    updateComicDto: UpdateComicDto,
  ): Promise<Comic> {
    return this.comicRepository.findOneObjectAndUpdate({ _id }, updateComicDto);
  }

  async findComicByIdAndSetComicPublisher(
    _id: string,
    publisher_id: string,
  ): Promise<any> {
    const comic = await this.comicRepository.findOneObject({ _id });
    if (!comic.publisher_id) {
      comic.publisher_id = publisher_id;
      return await this.comicRepository.findOneObjectAndUpdate({ _id }, comic);
    }
    return comic;
  }
  async findAllComics(limit?: number): Promise<any> {
    const allComics = await this.comicRepository.findObjectNoLimit(); // xử lý limit ở dưới
    let responeAllComics = <any>[];
    const filterAllComics = allComics.filter(
      (allComics) => allComics.add_chapter_time !== null,
    );
    filterAllComics.sort((a, b) => {
      return (
        this._toTimeStamp(b.add_chapter_time) -
        this._toTimeStamp(a.add_chapter_time)
      );
    });
    const limitedComics = limit
      ? filterAllComics.slice(0, limit)
      : filterAllComics;
    for (const allComic of limitedComics) {
      const responeAllComic = await this.getComicOption(allComic, true);
      responeAllComics.push(responeAllComic);
    }
    return responeAllComics;
  }

  async findsByCategory(categoryName: string, limit?: number): Promise<any> {
    const comics = await this.comicRepository.findObjectsBy(
      'categories',
      categoryName,
    );
    let responseComics: any[] = [];
    comics.sort((a, b) => {
      return b.reads - a.reads;
    });
    const limitedComics = limit ? comics.slice(0, limit) : comics;
    for (const comic of limitedComics) {
      const responseComic = await this.getComicOption(comic, false);
      responseComics.push(responseComic);
    }
    return responseComics;
  }

  async findHotComic(limit?: number): Promise<any> {
    const hotComics = await this.comicRepository.findObjectNoLimit();
    let responeHotComics = <any>[];
    const filterHotComics = hotComics.filter(
      (newComics) => newComics.add_chapter_time !== null,
    );
    filterHotComics.sort((a, b) => {
      return b.reads - a.reads;
    });
    const limitedComics = limit
      ? filterHotComics.slice(0, limit)
      : filterHotComics;
    for (const hotComic of limitedComics) {
      const responseHotComic = await this.getComicOption(hotComic, false);
      responeHotComics.push(responseHotComic);
    }
    return responeHotComics;
  }

  async findNewComic(limit?: number): Promise<any> {
    const newComics = await this.comicRepository.findObjectNoLimit();
    let responeNewComics = <any>[];
    const filterNewComics = newComics.filter(
      (newComics) => newComics.add_chapter_time !== null,
    );
    filterNewComics.sort((a, b) => {
      return (
        this._toTimeStamp(b.add_chapter_time) -
        this._toTimeStamp(a.add_chapter_time)
      );
    });
    const limitedComics = limit
      ? filterNewComics.slice(0, limit)
      : filterNewComics;
    for (const newComic of limitedComics) {
      const responeNewComic = await this.getComicOption(newComic, false);
      responeNewComics.push(responeNewComic);
    }
    return responeNewComics;
  }

  _toTimeStamp(strDate: string): number {
    const timestamp = moment(strDate, 'DD/MM/YYYY, hh:mm:ss').valueOf();
    return timestamp;
  }

  async publisherComics(publisherId: any): Promise<ResponsePublisherComic[]> {
    const publisherComics = await this.findComicByPublisherId(publisherId);

    return publisherComics;
  }

  async searchComics(query: string): Promise<ComicDocument[]> {
    let responeSearchComics = <any>[];
    const queryWithoutVietnameseMarks = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const rawRegex = new RegExp(query, 'i');
    const regex = new RegExp(queryWithoutVietnameseMarks, 'i');
    const comicSearched = await this.comicRepository.find({
      $or: [
        { title: rawRegex },
        { categories: { $elemMatch: { $regex: rawRegex } } },
        { title: regex },
        { categories: { $elemMatch: { $regex: regex } } },
      ],
    });
    const filterSearchComics = comicSearched.filter(
      (comicSearched) => comicSearched.add_chapter_time !== null,
    );

    for (const comic of filterSearchComics) {
      const responseComic = await this.getComicOption(comic, false);
      responseComic.description = comic.description
      responeSearchComics.push(responseComic);
    }
    return responeSearchComics;
  }

  async updateComic(
    comicId: string,
    comicUpdate: UpdateComicDto,
    image_detail: Express.Multer.File,
    image_thumnail_square: Express.Multer.File,
    image_thumnail_rectangle: Express.Multer.File,
  ): Promise<ComicDocument> {
    const comic = await this.comicRepository.findOneObject({ _id: comicId });
    if (comicUpdate.title) {
      comic.title = comicUpdate.title;
    }
    if (comicUpdate.reads) {
      comic.reads = comicUpdate.reads;
    }
    if (comicUpdate.description) {
      comic.description = comicUpdate.description;
    }
    if (comicUpdate.categories) {
      const categoriesUpdate = [];
      for (const categoryName of comicUpdate.categories) {
        const category = await this.categoryService.findCategory(categoryName);
        if (!category) {
          const category = await this.categoryService.createCategory(
            new CreateCategoryDto(categoryName),
          );
          categoriesUpdate.push(category.name);
        } else {
          categoriesUpdate.push(category.name);
        }
      }
      comic.categories = categoriesUpdate;
    }
    const imageDetailNew = new CreateImageDto();
    imageDetailNew.type = TypeImage.COMIC;
    if (image_detail) {
      const imageDetail = await this.imageService.createComicImageFile(
        imageDetailNew,
        image_detail,
      );
      comic.image_detail_id = imageDetail.id;
    }
    if (image_thumnail_square) {
      const imageThumnailSquare = await this.imageService.createComicImageFile(
        imageDetailNew,
        image_detail,
      );
      comic.image_thumnail_square_id = imageThumnailSquare.id;
    }
    if (image_thumnail_rectangle) {
      const imageThumnailRectangle =
        await this.imageService.createComicImageFile(
          imageDetailNew,
          image_detail,
        );
      comic.image_thumnail_rectangle_id = imageThumnailRectangle.id;
    }

    comic.update_time = new Date().toLocaleString('en-GB', { hour12: false });
    const comicUpdated = await comic.save();
    return comicUpdated;
  }

  async removeChapterFromComic(chapterId: string, comicId: string): Promise<boolean> {
    const comic = await this.comicRepository.findOneObject({ comicId });

    const chapterIndex = comic.chapters.findIndex(
      (chapter) => chapter.chapter_id === chapterId
    );
    if (chapterIndex !== -1) {
      comic.chapters.splice(chapterIndex, 1);
      comic.add_chapter_time = new Date().toLocaleString('en-GB', {
        hour12: false,
      });;
      await comic.save()
      return true;
    }
    return false;
  }


}
