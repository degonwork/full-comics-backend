import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EntityRepository } from "../../repository/entity.repository";
import { ImageService } from "../../image/image.service";
import { User, UserDocument } from "../schema/user.schema";

export class UserRepository extends EntityRepository<UserDocument>{
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>,  imageService: ImageService) {
        super(userModel, imageService);
    }
}