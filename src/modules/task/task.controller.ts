import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { PaginateTasksDto } from './dto/paginate_task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { LoggerService } from '../../common/logger/logger.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Task } from './entities/task.entity';
import { TaskDto } from './dto/task.dto';

@ApiTags('Task')
@Controller({
  path: 'task',
  version: '1',
})
export class TaskController {
  constructor(
    private readonly logger: LoggerService,
    private readonly taskService: TaskService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.logger.setContext(TaskController.name);
  }

  @Get('paginate')
  @ApiBody({ type: PaginateTasksDto })
  async getTasks(
    @Req() request: any,
    @Res() response: any,
    @Query() paginateTasksDto: PaginateTasksDto,
  ) {
    try {
      const tasks = await this.taskService.paginateTasks(
        request.user['id'],
        paginateTasksDto,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Tasks fetched successfully',
        data: tasks,
      });
    } catch (error) {
      this.logger.error(error.message);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  @Post('create')
  @ApiBody({ type: CreateTaskDto })
  async createTask(
    @Res() response: any,
    @Req() request: any,
    @Body() body: CreateTaskDto,
  ) {
    try {
      const newTask = this.classMapper.map(body, CreateTaskDto, Task);
      newTask.user = request?.user;
      await this.taskService.createTask(newTask);
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Task created successfully',
      });
    } catch (err) {
      this.logger.error(err.message);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message ?? 'Something went wrong',
      });
    }
  }

  @Patch('update/:taskId')
  @ApiBody({ type: TaskDto })
  async updateTask(
    @Res() response: any,
    @Req() request: any,
    @Body() body: TaskDto,
    @Param('taskId') taskId: number,
  ) {
    try {
      const existingTask = await this.taskService.findTaskByPk(taskId);
      if (!existingTask) {
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Task not found',
        });
      }
      await this.classMapper.mutateAsync(body, existingTask, TaskDto, Task);
      if (existingTask.user.id !== request.user.id) {
        return response.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'You are not authorized to update this task',
        });
      }
      await this.taskService.updateTask(existingTask);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Task updated successfully',
      });
    } catch (err) {
      this.logger.error(err.message);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message ?? 'Something went wrong',
      });
    }
  }

  @Delete('delete/:taskId')
  async deleteTask(
    @Res() response: any,
    @Req() request: any,
    @Param('taskId') taskId: number,
  ) {
    try {
      await this.taskService.deleteTask(taskId);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Task deleted successfully',
      });
    } catch (err) {
      this.logger.error(err.message);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message ?? 'Something went wrong',
      });
    }
  }
}
