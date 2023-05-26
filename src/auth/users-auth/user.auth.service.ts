import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PublisherService } from 'src/publisher/publisher.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ExistingUser } from 'src/user/dto/existing-user.dto';
import { UserDocument } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly publisherService: PublisherService,

    private readonly jwtService: JwtService,
  ) {}

  // Mã hóa mật khẩu
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  // Tạo token
  private async _createToken(
    user: UserDocument,
    refresh: boolean,
  ): Promise<any> {
    const accessToken = this.jwtService.sign({ user });

    // if (!refresh) {
    const refreshToken = this.jwtService.sign(
      { user },
      {
        secret: process.env.SECRETKEY_REFRESH,
        expiresIn: process.env.EXPIRESIN_REFRESH,
      },
    );
    await this.userService.updateRefreshToken(user.userName, {
      refreshToken: refreshToken,
    });
    return { accessToken, refreshToken };
  }
  // Kiểm tra người dùng
  async validateUser(email: string, password: string) {
    const user = await this.userService.findbyEmail(email);
    if (!user) return null;
    const doesPasswordMath = await bcrypt.compare(password, user.password);
    if (!doesPasswordMath) return null;
    return this.userService.getDetailUser(user);
  }

  // Đăng ký

  async register(newUser: CreateUserDto) {
    const existingUser = await this.userService.findbyUserName(
      newUser.userName,
    );
    if (existingUser) return 'UserName Existed!';
    newUser.password = await this.publisherService.hashPassword(
      newUser.password,
    );
    return this.userService.createUser(newUser);
  }

  // Dăng nhập
  async login(existingUser: ExistingUser) {
    const { userName, password } = existingUser;
    const user = await this.userService.validateUser(userName, password);
    if (!user) return false;
    const token = await this._createToken(user, false);
    return { ...token };
  }

  // Refresh token
  async refresh(refreshToken: string): Promise<any> {
    try {
      const payload = await this.jwtService.verify(refreshToken, {
        secret: process.env.SECRETKEY_REFRESH,
      });
      const user = await this.userService.getUserByRefresh(
        refreshToken,
        payload.user.userName,
      );
      const newAccessToken = await this._createToken(user, true);
      return newAccessToken;
    } catch (e) {
      return 'Invalid token';
    }
  }
}
