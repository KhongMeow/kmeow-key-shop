import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityModule } from './identity/identity.module';
import { ProductsModule } from './products/products.module';
import { SetupModule } from './setup/setup.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        autoLoadEntities: true,
        synchronize: true,
        extra: {
          softDelete: true,
        },
      })
    }),
    SetupModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    RolePermissionsModule,
    IdentityModule,
    ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
