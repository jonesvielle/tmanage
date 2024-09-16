import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';
import { LoggerService } from '../../common/logger/logger.service';
import { PaginateUsersDto } from './dto/paginated-users.dto';
import { User } from './entities/user.entity';
import { CoreUtils } from '../../common/utils/core.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UserService.name);
  }

  /**
   * Create a new user.
   * This method is used to create a new user in the database.
   * @param user - User data to create a new user.
   */
  async createUser(user: User) {
    user.password = CoreUtils.hashPassword(user.password);
    const newUser = this.userRepository.create(user);
    return this.entityManager.save(newUser);
  }

  /**
   * Find a user by ID and update it with the new user data.
   * @param userId
   */
  async findByPk(userId: number) {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  /**
   * Find a user by username.
   * @param username
   */
  async findByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username: username } });
  }

  /**
   * Create a new user. This method is used to create a new user in the database.
   * @param paginateUsersDto
   */
  async paginateUsers(paginateUsersDto: PaginateUsersDto) {
    const { page = 1, limit = 10, sort, search } = paginateUsersDto;

    // Create query conditions to filter by search term
    const where: FindOptionsWhere<User> = {};
    if (search) {
      where.username = Like(`%${search}%`); // Assuming we're filtering by name; adjust as needed
    }

    // Define sorting logic for fields like name or createdAt
    const order: FindManyOptions<User>['order'] = {};
    if (sort) {
      const [key, direction] = sort.split(':');
      if (['name', 'createdAt'].includes(key)) {
        order[key] = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      }
    }

    // Paginate users, filter by search term, and sort by specified field
    const [users, total] = await this.entityManager.findAndCount(User, {
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users,
      meta: {
        totalItems: total,
        itemCount: users.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  /**
   * Find a user by ID and update it with the new user data.
   * @param userId
   */
  async deleteUser(userId: number) {
    this.logger.log(`User with ID ${userId} has been deleted`);
    return await this.userRepository.delete(userId);
  }
}
