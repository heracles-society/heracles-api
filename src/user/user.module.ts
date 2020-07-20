import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { UserProvider } from './user.provider';
import { ApplicationModule } from '../society/application/application.module';

@Module({
  imports: [DatabaseModule, ApplicationModule],
  controllers: [UserController],
  providers: [UserService, ...UserProvider.getProviders()],
  exports: [UserService],
})
export class UserModule {}
