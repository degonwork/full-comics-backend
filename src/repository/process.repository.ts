import { Injectable } from "@nestjs/common";
import { ImageService } from "../image/image.service";

@Injectable()
export abstract class ProcessRepository {
    constructor(private readonly imageService: ImageService){}

    async loopObject(listObjects: any, createObjectDto: any, createObjects: any): Promise<void> {
        for (const object of listObjects) {
            let image = await this.imageService.findImageById(object.image_id);
            const createDataDto = new createObjectDto(object.chapter_intro ?? object.title, image.path)
            createObjects.push(createDataDto);
        }
    }
}