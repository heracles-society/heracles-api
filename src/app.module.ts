import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SocietyModule } from './society/society.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      expandVariables: true,
    }),
    DatabaseModule,
    SocietyModule,
  ],
  providers: [],
})
export class AppModule {}
