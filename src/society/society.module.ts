import { Module } from '@nestjs/common';
import { SocietyController } from './society.controller';
import { SocietyService } from './society.service';
import { SocietyProvider } from './society.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SocietyController],
  providers: [SocietyService, ...SocietyProvider.getProviders()],
})
export class SocietyModule {}
