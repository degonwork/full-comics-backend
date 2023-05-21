import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUUIDUserDto } from './dto/create-uuid-user.dto';
import { UserRepository } from './repository/user.repository';
import { UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // Lay du lieu nguoi dung
  async getDetailUser(user: UserDocument): Promise<any> {
    return {
      id: user._id,
      userName: user.userName,
      email: user.email,
      subscriptions: user.subscriptions,
      image_id: user.image_id,
    };
  }

  // Tim kiem nguoi dung theo email
  async findbyEmail(email: string): Promise<UserDocument> {
    return this.userRepository.findOneObject({ email });
  }

  async findbyUserName(userName: string): Promise<UserDocument> {
    return this.userRepository.findOneObject({ userName });
  }

  async findbyUUID(uuid: string): Promise<UserDocument> {
    return this.userRepository.findOneObject({ uuid });
  }

  async findbyId(_id: string): Promise<UserDocument> {
    return this.userRepository.findOneObject({ _id });
  }

  // Tao moi nguoi dung
  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userRepository.createObject(createUserDto);
  }

  async createUUIDUser(
    createUUIDUserDto: CreateUUIDUserDto,
  ): Promise<UserDocument> {
    return this.userRepository.createObject(createUUIDUserDto);
  }

  // Cap nhanh refreshToken user
  async updateRefreshToken(userName: string, update: { refreshToken: string }) {
    const existingUser = await this.findbyEmail(userName);
    if (existingUser) {
      if (update.refreshToken) {
        update.refreshToken = await bcrypt.hash(
          update.refreshToken.split('').reverse().join(''),
          10,
        );
      }
      existingUser.refreshToken = update.refreshToken;
    }
    return existingUser.save();
  }

  async getUserByRefresh(refreshToken: string, userName: string) {
    const user = await this.findbyUserName(userName);
    if (!user) {
      throw new HttpException('not found user', HttpStatus.UNAUTHORIZED);
    }
    const is_equal = await bcrypt.compare(
      refreshToken.split('').reverse().join(''),
      user.refreshToken,
    );
    if (!is_equal) {
      throw new HttpException('not found user', HttpStatus.UNAUTHORIZED);
    }
    return this.getDetailUser(user);
  }

  // Huydev ...................................................................................

  async validateUser(userName: string, password: string) {
    const user = await this.findbyUserName(userName);
    if (!user) return null;
    const doesPasswordMath = await bcrypt.compare(password, user.password);
    if (!doesPasswordMath) return null;
    return this.getDetailUser(user);
  }
}
