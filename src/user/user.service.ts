import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    // Lay du lieu nguoi dung
    async getDetailUser(user: UserDocument): Promise<any> {
        return {
            id: user._id,
            userName: user.userName,
            email: user.email,
        }
    }

    // Tim kiem nguoi dung theo email
    async findbyEmail(email: string): Promise<UserDocument> {
        return this.userRepository.findOneObject({ email });
    }

    // Tao moi nguoi dung
    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        return this.userRepository.createObject(createUserDto);
    }

    // Cap nhanh refreshToken user 
    async updateRefreshToken(email, update) {
        const existingUser = await this.findbyEmail(email);
        if (existingUser) {
            if (update.refreshToken) {
                update.refreshToken = await bcrypt.hash(
                    update.refreshToken.split("").reverse().join(""),
                    10,
                );
            }
            existingUser.refreshToken = update.refreshToken;
        }
        return existingUser.save();
    }

    async getUserByRefresh(refreshToken, email) {
        const user = await this.findbyEmail(email);
        if (!user) {
            throw new HttpException("not found user", HttpStatus.UNAUTHORIZED);
        }
        const is_equal = await bcrypt.compare(
            refreshToken.split("").reverse().join(""),
            user.refreshToken,
        )
        if (!is_equal) {
            throw new HttpException("not found user", HttpStatus.UNAUTHORIZED);
        }
        return this.getDetailUser(user);
    }
}
