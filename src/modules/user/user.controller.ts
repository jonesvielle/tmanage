import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoggerService } from '../../common/logger/logger.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PaginateUsersDto } from './dto/paginated-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.logger.setContext(UserController.name);
  }

  @Get('paginate')
  @ApiBody({ type: PaginateUsersDto })
  async getUsers(
    @Query() paginateUsersDto: PaginateUsersDto,
    @Res() response: any,
  ) {
    try {
      return this.userService.paginateUsers(paginateUsersDto);
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  @Public()
  @Post('create')
  @ApiBody({ type: CreateUserDto })
  async createUser(@Res() response: any, @Body() body: CreateUserDto) {
    try {
      const newUser = await this.classMapper.mapAsync(
        body,
        CreateUserDto,
        User,
      );
      await this.userService.createUser(newUser);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User created',
      });
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  @Delete('delete/:id')
  async deleteUser(@Res() response: any, @Param('id') id: number) {
    try {
      await this.userService.deleteUser(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User deleted',
      });
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
}
