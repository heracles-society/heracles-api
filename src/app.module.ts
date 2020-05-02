import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      expandVariables: true,
    }),
    DatabaseModule,
    UsersModule,
  ],
  providers: [],
})
export class AppModule {}
