import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    // Lay du lieu nguoi dung
    async getDetailUser(user: UserDocument): Promise<any> {
        return {
            id: user._id,
            userName: user.userName,
            email: user.email,
        }
    }

    // Tim kiem nguoi dung theo email
    async findbyEmail(email:string) : Promise<UserDocument> {
        return this.userModel.findOne({email}).exec();
    }

    // Tao moi nguoi dung
    async create(createUser: CreateUserDto): Promise<UserDocument> {
        const newUser = new this.userModel();
        newUser.userName = createUser.userName;
        newUser.email = createUser.email;
        newUser.password = createUser.password;
        return newUser.save();
    }



}
