import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { LoggerService } from '../../common/logger/logger.service';
import { Task } from './entities/task.entity';
import { PaginateTasksDto } from './dto/paginate_task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(TaskService.name);
  }

  async createTask(task: Task) {
    const newTask = this.taskRepository.create(task);
    return this.entityManager.save(newTask);
  }

  /**
   * Find a task by ID and update it with the new task data.
   * @param task - New task data to update the task with the given ID.
   */
  async updateTask(task: Task): Promise<Task> {
    return await this.taskRepository.save(task);
  }

  /**
   * Find a task by ID.
   * @param taskId - Task ID to find.
   */
  async findTaskByPk(taskId: number) {
    return await this.taskRepository.findOne({ where: { id: taskId } });
  }

  /**
   * Find a task by ID and delete it.
   * @param taskId
   */
  async deleteTask(taskId: number) {
    this.logger.log(`Task with ID ${taskId} has been deleted`);
    return await this.taskRepository.delete(taskId);
  }

  /**
   * Paginate tasks by user, status, priority,
   * and sort by priority or dueDate fields in ascending or descending order based on the sort query parameter.
   * @param userId
   * @param paginateTasksDto
   */
  async paginateTasks(userId: number, paginateTasksDto: PaginateTasksDto) {
    const { page = 1, limit = 10, status, priority, sort } = paginateTasksDto;

    // Create query conditions to filter by user, status, and priority
    const where: FindOptionsWhere<Task> = { user: { id: userId } }; // Filter tasks by user
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }

    // Define sorting logic for priority or dueDate
    const order: FindManyOptions<Task>['order'] = {};
    if (sort) {
      const [key, direction] = sort.split(':');
      if (['priority', 'dueDate'].includes(key)) {
        order[key] = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      }
    }

    // Paginate tasks, filter by user, status, and priority, and sort by priority or dueDate
    const [tasks, total] = await this.entityManager.findAndCount(Task, {
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: tasks,
      meta: {
        totalItems: total,
        itemCount: tasks.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }
}
