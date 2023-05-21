import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PublisherAuthController } from './publisher.auth.controller';
import { PublisherAuthService } from './publisher.auth.service';
import { PublisherJwtStrategy } from './strategies/jwt.strategy';
import { PublisherModule } from 'src/publisher/publisher.module';

@Module({
  imports: [
    PublisherModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRETKEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRESIN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PublisherAuthController],
  providers: [PublisherAuthService, PublisherJwtStrategy],
})
export class PublisherAuthModule {}
