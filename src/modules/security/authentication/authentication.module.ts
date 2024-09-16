import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from '../../user/user.module';
import { LoggerModule } from '../../../common/logger/logger.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtService],
  imports: [
    UserModule,
    LoggerModule,
    HttpModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get<string>('keys.privateKey'),
        publicKey: configService.get<string>('keys.publicKey'),
        signOptions: { expiresIn: 3600, algorithm: 'RS256' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthenticationService, JwtModule, PassportModule],
})
export class AuthenticationModule {}
