export class ResponsePublisherComic {
  _id: string;
  image_detail_path: string;
  image_thumnail_square_path: string;
  image_thumnail_rectangle_path: string;
  title: string;
  constructor(
    comic: any,
    image_detail_path: string,
    image_thumnail_square_path: string,
    image_thumnail_rectangle_path: string,
  ) {
    this._id = comic._id;
    this.title = comic.title;
    this.image_detail_path = image_detail_path;
    this.image_thumnail_square_path = image_thumnail_square_path;
    this.image_thumnail_rectangle_path = image_thumnail_rectangle_path;
  }
}
