import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { LoggerService } from '../../../common/logger/logger.service';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthenticationController {
  constructor(
    private readonly logger: LoggerService,
    private readonly authenticationService: AuthenticationService,
  ) {
    this.logger.setContext(AuthenticationController.name);
  }

  @Public()
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Res() response: any, @Body() body: LoginDto) {
    try {
      const auth = await this.authenticationService.login(body);
      return response.status(HttpStatus.OK).json(auth);
    } catch (err) {
      this.logger.error(`Error: ${err.message}`);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `${err.message}`,
      });
    }
  }
}
