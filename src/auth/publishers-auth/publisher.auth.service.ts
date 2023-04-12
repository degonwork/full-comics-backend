import { Injectable } from "@nestjs/common";
import { PublisherService } from "src/publisher/publisher.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { PublisherDocument } from "src/publisher/schema/publisher.schema";
import { ExistingPublisher } from "src/publisher/dto/existing-publisher.dto";
import { CreatePublisherDto } from "src/publisher/dto/create-publisher.dto";

@Injectable()
export class PublisherAuthService {
    constructor(
        private readonly publisherService: PublisherService,
        private readonly jwtService: JwtService) { }

    //Brycpt
    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    // Tao token
    private async _createToken(publisher: PublisherDocument, refresh: boolean): Promise<any> {
        const accessToken = this.jwtService.sign({ publisher });
        if (!refresh) {
            const refreshToken = this.jwtService.sign({ publisher }, {
                secret: process.env.SECRETKEY_REFRESH,
                expiresIn: process.env.EXPIRESIN_REFRESH,
            });
            await this.publisherService.updateRefreshToken(publisher.publisherName, { refreshToken: refreshToken });
            return { accessToken, refreshToken };
        } else {
            return { accessToken };
        }
    }
    // Kiem tra nguoi dung 
    async validateUser(publisherName: string, password: string) {
        const publisher = await this.publisherService.findbyPublishername(publisherName);
        if (!publisher) return null;
        const doesPasswordMath = await bcrypt.compare(password, publisher.password);
        if (!doesPasswordMath) return null;
        return this.publisherService.getDetailPublisher(publisher);
    }
    // login
    async login(existingPublisher: ExistingPublisher) {
        const { publisherName, password } = existingPublisher;
        const publisher = await this.validateUser(publisherName, password);
        if (!publisher) return "PublisherName is not registered or password is not correct";
        const token = await this._createToken(publisher, false);
        return { ...token };
    }
    // register
    async register(newPublisher: CreatePublisherDto) {
        const existingPublisher = await this.publisherService.findbyPublishername(newPublisher.publisherName);
        if (existingPublisher)
            return "PublisherName Existed!";
        newPublisher.password = await this.hashPassword(newPublisher.password);
        return this.publisherService.createPublisher(newPublisher);

    }


    // logout
    async logout(publisher: PublisherDocument) {
        await this.publisherService.updateRefreshToken(publisher.publisherName, { refreshToken: null })
        return {
            statusCode: 200,
            message: 'Logout successfully'
        };
    }

    // Refresh token 
    async refresh(refreshToken: string): Promise<any> {
        try {
            const payload = await this.jwtService.verify(refreshToken, {
                secret: process.env.SECRETKEY_REFRESH
            });
            const publisher = await this.publisherService.getPublisherByRefresh(refreshToken, payload.user.email);
            const newAccessToken = await this._createToken(publisher, true);
            return newAccessToken;
        } catch (e) {
            return "Invalid token";
        }
    }

}