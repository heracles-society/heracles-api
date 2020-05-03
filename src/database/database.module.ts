import { Module } from '@nestjs/common';

import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

const databaseProviders = [
  {
    inject: [ConfigService],
    provide: DATABASE_CONNECTION,
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> => {
      const dbURL = configService.get<string>('DATABASE_URL');
      return await mongoose.connect(dbURL, {
        /**
         * To handle the deprecation warning while using findOneAndUpdate() and findOneAndRemove()
         */
        useFindAndModify: false,
      });
    },
  },
];

@Module({
  imports: [ConfigModule],
  exports: [...databaseProviders],
  providers: [...databaseProviders],
})
export class DatabaseModule {}
