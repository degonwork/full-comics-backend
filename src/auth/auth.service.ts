import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ExistingUser } from 'src/user/dto/existing-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    // Ma hoa mat khau
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    // Dang ky 
    async register(newUser: CreateUserDto) {
        const { userName, email, password } = newUser;
        const existingUser = await this.userService.findbyEmail(email);
        if (existingUser) return "Email Taken!";
        newUser.password = await this.hashPassword(password);
        const createNewUser = await this.userService.create(newUser);
        return this.userService.getDetailUser(createNewUser);
    }

    // Kiem tra nguoi dung 
    async validateUser(email: string, password: string) {
        const user = await this.userService.findbyEmail(email);
        if (!user) return null;
        const doesPasswordMath = await bcrypt.compare(password, user.password);
        if (!doesPasswordMath) return null;
        return this.userService.getDetailUser(user);
    }

    // Dang nhap
    async login(existingUser: ExistingUser) {
        const { email, password } = existingUser;
        const user = await this.validateUser(email, password);
        if (!user) return "Email is not registered or password is not correct";
        const token = await this.jwtService.signAsync({ user });
        return { token: token };
    }
}
