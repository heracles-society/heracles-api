import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { DatabaseModule } from '../../database/database.module';
import { ComplaintProvider } from './complaint.provider';
import { ComplaintController } from './complaint.controller';

@Module({
  imports: [DatabaseModule],
  providers: [ComplaintService, ...ComplaintProvider.getProviders()],
  exports: [ComplaintService],
  controllers: [ComplaintController],
})
export class ComplaintModule {}
