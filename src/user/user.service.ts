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
    try {
      const result: UserDocument | null =
        await this.userRepository.findOneObject({ email });

      if (result) {
        return result;
      } else {
        throw new Error('User not found by email');
      }
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async findbyUserName(userName: string): Promise<UserDocument> {
    try {
      const result: UserDocument | null =
        await this.userRepository.findOneObject({ userName });

      if (result) {
        return result;
      } else {
        throw new Error('User not found by username');
      }
    } catch (error) {
      throw new Error(`Error finding user by username: ${error.message}`);
    }
  }

  async findbyUUID(uuid: string): Promise<UserDocument> {
    try {
      const result: UserDocument | null =
        await this.userRepository.findOneObject({ uuid });

      if (result) {
        return result;
      } else {
        throw new Error('User not found by UUID');
      }
    } catch (error) {
      throw new Error(`Error finding user by UUID: ${error.message}`);
    }
  }

  async findbyId(_id: string): Promise<UserDocument> {
    try {
      const result: UserDocument | null =
        await this.userRepository.findOneObject({ _id });

      if (result) {
        return result;
      } else {
        throw new Error('User not found by ID');
      }
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
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
