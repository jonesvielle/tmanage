import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../../common/enums/task_status';
import { Priority } from '../../../common/enums/priority.enum';
import { IsDate, IsString } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export class CreateTaskDto {
  @AutoMap()
  @ApiProperty()
  @IsString({ message: 'Title must be a string' })
  title: string;

  @AutoMap()
  @ApiProperty()
  @IsString({ message: 'Description must be a string' })
  description: string;

  @AutoMap()
  @ApiProperty({
    type: 'string',
    enum: Object.values(TaskStatus),
    name: 'status',
    description: 'Possible status for tasks',
  })
  @IsString({ message: 'Status must be a string' })
  status: string;

  @AutoMap()
  @ApiProperty({
    type: 'string',
    enum: Object.values(Priority),
    name: 'priority',
    description: 'Possible priority for tasks',
  })
  @IsString({ message: 'Priority must be a string' })
  priority: string;

  @AutoMap()
  @ApiProperty()
  @IsDate({ message: 'Due date must be a valid date' })
  dueDate: Date;
}
