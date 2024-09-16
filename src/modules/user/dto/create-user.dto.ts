import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';
import { AutoMap } from "@automapper/classes";

export class CreateUserDto {
  @AutoMap()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @AutoMap()
  @ApiProperty({
    type: 'string',
    name: 'role',
    description: 'Possible roles for users',
    enum: Object.values(Role),
  })
  @IsString()
  @IsNotEmpty()
  role: string;
}
