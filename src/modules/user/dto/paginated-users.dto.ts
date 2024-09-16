import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginateUsersDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({
    required: false,
    example: 'name:asc',
    description: 'Sort by field, e.g., "name:asc" or "createdAt:desc"',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string; // Optional search term to filter users by name or email
}
