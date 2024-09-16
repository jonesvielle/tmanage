import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

/**
 * @description Mapping profile for user entity and dto objects and vice versa.
 */
@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  /**
   * @description Mapping profile for user entity and dto objects and vice versa.
   * @returns MappingProfile
   */
  override get profile(): MappingProfile {
    return (mapper) => {
      // Create mapping between CreateUserDto and User entity.
      createMap(mapper, CreateUserDto, User);
      // Create mapping between User entity and CreateUserDto.
      createMap(mapper, User, CreateUserDto);
      // Create mapping between User entity and UserDto.
      createMap(mapper, User, UserDto);
      // Create mapping between UserDto and User entity.
      createMap(mapper, UserDto, User);
    };
  }
}
