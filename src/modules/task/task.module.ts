import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { AutomapperModule } from '@automapper/nestjs';
import { LoggerModule } from '../../common/logger/logger.module';
import { classes } from '@automapper/classes';
import { TaskProfile } from './task.profile';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskProfile],
  imports: [
    TypeOrmModule.forFeature([Task]),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    LoggerModule,
  ],
  exports: [TaskService],
})
export class TaskModule {}
