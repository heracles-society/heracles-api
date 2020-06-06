import { Module } from '@nestjs/common';
import { SocietyController } from './society.controller';
import { SocietyService } from './society.service';
import { SocietyProvider } from './society.provider';

@Module({
  controllers: [SocietyController],
  providers: [SocietyService, ...SocietyProvider.getProviders()],
})
export class SocietyModule {}
