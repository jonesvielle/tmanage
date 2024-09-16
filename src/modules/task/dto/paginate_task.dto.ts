import { TaskStatus } from '../../../common/enums/task_status';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Priority } from '../../../common/enums/priority.enum';

export class PaginateTasksDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false, enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ required: false, enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiProperty({
    required: false,
    example: 'priority:desc',
    description: 'Sort by field, e.g., "priority:desc" or "dueDate:asc"',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}
