import { Injectable } from "@nestjs/common";
import { ImageService } from "../../image/image.service";
import { ProcessRepository } from "../../repository/process.repository";

@Injectable()
export class HomeRepository extends ProcessRepository {
    constructor(imageService: ImageService) {
        super(imageService);
     }
    
}