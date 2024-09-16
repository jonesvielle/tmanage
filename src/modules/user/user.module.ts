import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AutomapperModule } from '@automapper/nestjs';
import { LoggerModule } from '../../common/logger/logger.module';
import { classes } from '@automapper/classes';
import { UserProfile } from './user.profile';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    LoggerModule,
  ],
  providers: [UserService, UserProfile],
})
export class UserModule {}
