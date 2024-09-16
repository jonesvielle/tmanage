import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './security/authentication/strategy/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [SecurityModule, UserModule, TaskModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtService,
  ],
})
export class ModulesModule {}
