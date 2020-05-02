import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { userProviders } from './users.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UserService, ...userProviders],
})
export class UsersModule {}
