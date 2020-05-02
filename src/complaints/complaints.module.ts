import { Module } from '@nestjs/common';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsService } from './complaints.service';
import { complaintProviders } from './complaints.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ComplaintsController],
  providers: [ComplaintsService, ...complaintProviders],
})
export class ComplaintsModule {}
