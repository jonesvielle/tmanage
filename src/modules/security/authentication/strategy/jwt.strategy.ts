import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../user/entities/user.entity';
import { Strategy } from 'passport';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      algorithms: ['RS256'],
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('keys.publicKey') || 'secretKey',
    });
  }

  /**
   * @description Validate the token and return the user
   * @param payload string
   * @returns User
   */
  async validate(payload: any): Promise<User> {
    // Accept the JWT and attempt to validate it using the user service
    const user = await this.userService.findByUsername(payload.username);

    // If the user is not found, throw an error
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    // If the user is found, return the user
    return user;
  }
}
