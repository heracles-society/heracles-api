import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SocietyModule } from './society/society.module';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { RoleBindingModule } from './role-binding/role-binding.module';
import { RoleModule } from './role/role.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      expandVariables: true,
    }),
    DatabaseModule,
    SocietyModule,
    UserModule,
    AuthModule,
    RoleModule,
    RoleBindingModule,
    PaymentModule,
  ],
  providers: [],
})
export class AppModule {}
