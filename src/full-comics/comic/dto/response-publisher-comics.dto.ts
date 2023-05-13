export class ResponsePublisherComic {
  _id: string;
  image_detail: string;
  image_thumnail_square: string;
  image_thumnail_rectangle: string;
  title: string;
  constructor(
    comic: any,
    image_detail_path: string,
    image_thumnail_square_path: string,
    image_thumnail_rectangle_path: string,
  ) {
    this._id = comic._id;
    this.title = comic.title;
    this.image_detail = image_detail_path;
    this.image_thumnail_square = image_thumnail_square_path;
    this.image_thumnail_rectangle = image_thumnail_rectangle_path;
  }
}
