import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../../../common/logger/logger.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(AuthenticationService.name);
  }

  async login(dto: LoginDto) {
    const exisingUser = await this.userService.findByUsername(dto.username);
    if (!exisingUser) {
      return new NotFoundException('User does not exist');
    }
    if (!bcrypt.compareSync(dto.password, exisingUser.password)) {
      return new NotFoundException('Invalid password');
    }
    const payload = {
      username: exisingUser.username,
      sub: exisingUser.id,
      role: exisingUser.role,
    };
    return {
      content: {
        accessToken: this.jwtService.sign(payload, {
          privateKey: this.configService.get<string>('keys.privateKey'),
          algorithm: 'RS256',
        }),
      },
    };
  }
}
