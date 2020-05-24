import { Module } from '@nestjs/common';
import { ComplaintsController } from './complaints.controller';
import { ComplaintService } from './complaints.service';
import { complaintProviders } from './complaints.provider';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [DatabaseModule, UsersModule, UtilsModule],
  controllers: [ComplaintsController],
  providers: [ComplaintService, ...complaintProviders],
})
export class ComplaintsModule {}
