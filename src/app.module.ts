import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { SocietiesModule } from './societies/societies.module';
import { InventoriesModule } from './inventories/inventories.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { ReservationsModule } from './reservations/reservations.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { MessagesModule } from './messages/messages.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      expandVariables: true,
    }),
    ComplaintsModule,
    DatabaseModule,
    OrganizationsModule,
    SocietiesModule,
    UsersModule,
    InventoriesModule,
    ReservationsModule,
    EventsModule,
    AuthModule,
    UtilsModule,
    MessagesModule,
    OrdersModule,
  ],
  providers: [],
})
export class AppModule {}
