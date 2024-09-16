import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskDto } from "./dto/task.dto";

/**
 * @description Mapping profile for task entity and dto objects and vice versa.
 */
@Injectable()
export class TaskProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  /**
   * @description Mapping profile for task entity and dto objects and vice versa.
   * @returns MappingProfile
   */
  override get profile(): MappingProfile {
    return (mapper) => {
      // Create mapping between CreateTaskDto and Task entity.
      createMap(mapper, CreateTaskDto, Task);
      // Create mapping between Task entity and TaskDto.
      createMap(mapper, Task, TaskDto);
      // Create mapping between TaskDto and Task entity.
      createMap(mapper, TaskDto, Task);
    };
  }
}
