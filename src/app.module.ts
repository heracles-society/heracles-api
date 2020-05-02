import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { SocietiesModule } from './societies/societies.module';
import { UsersModule } from './users/users.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { InventoryModule } from './inventory/inventory.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      expandVariables: true,
    }),
    DatabaseModule,
    OrganizationsModule,
    SocietiesModule,
    UsersModule,
    ComplaintsModule,
    InventoryModule,
  ],
  providers: [],
})
export class AppModule {}
