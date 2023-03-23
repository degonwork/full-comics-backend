import { Injectable } from "@nestjs/common";
import { ImageService } from "src/image/image.service";

@Injectable()
export class HomeRepository {
    constructor(private readonly imageService: ImageService) { }
    async loopObject(listObjects: any, createObjectDto: any, createObjects: any): Promise<void> {
        for (const object of listObjects) {
            console.log(this.imageService);
            let image = await this.imageService.findImageById(object.image_id);
            const createDataDto = new createObjectDto(object.chapter_intro, image.path)
            createObjects.push(createDataDto);
        }
    }
}