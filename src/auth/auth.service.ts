import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ExistingUser } from '../user/dto/existing-user.dto';
import { UserDocument } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    // Ma hoa mat khau
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    // Tạo token
    private async _createToken(user: UserDocument, refresh: boolean): Promise<any> {
        const accessToken = this.jwtService.sign({ user });
        if (!refresh) {
            const refreshToken = this.jwtService.sign({ user }, {
                secret: process.env.SECRETKEY_REFRESH,
                expiresIn: process.env.EXPIRESIN_REFRESH,
            });
            await this.userService.updateRefreshToken(user.email, { refreshToken: refreshToken });
            return { accessToken, refreshToken };
        } else {
            return { accessToken };
        }
    }

    // Kiem tra nguoi dung 
    async validateUser(email: string, password: string) {
        const user = await this.userService.findbyEmail(email);
        if (!user) return null;
        const doesPasswordMath = await bcrypt.compare(password, user.password);
        if (!doesPasswordMath) return null;
        return this.userService.getDetailUser(user);
    }

    // Dang ky 
    async register(uuid: string, newUser: CreateUserDto) {
        const { email, password } = newUser;
        const userUUID = await this.userService.findbyUUID(uuid);
        if (userUUID) {
            const existingUser = await this.userService.findbyEmail(email);
            if (existingUser) return "Email Taken!";
            newUser.password = await this.hashPassword(password);
            const createNewUser = await this.userService.createUser(uuid, newUser);
            return this.userService.getDetailUser(createNewUser);
        } else {
            return 'user is not Exist';
        }

    }

    // Dang nhap
    async login(existingUser: ExistingUser) {
        const { email, password } = existingUser;
        const user = await this.validateUser(email, password);
        if (!user) return "Email is not registered or password is not correct";
        const token = await this._createToken(user, false);
        return { ...token };
    }

    // Refresh token
    async refresh(refreshToken: string): Promise<any> {
        try {
            const payload = await this.jwtService.verify(refreshToken, {
                secret: process.env.SECRETKEY_REFRESH
            });
            const user = await this.userService.getUserByRefresh(refreshToken, payload.user.email);
            const newAccessToken = await this._createToken(user, true);
            return newAccessToken;
        } catch (e) {
            return "Invalid token";
        }
    }

    // Logout
    async logout(user: UserDocument) {
        await this.userService.updateRefreshToken(user.email, { refreshToken: null })
        return {
            statuscode: 200
        };
    }
}
