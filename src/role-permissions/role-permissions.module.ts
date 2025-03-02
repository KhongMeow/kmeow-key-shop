import { Module } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { RolePermissionsController } from './role-permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/identity/config/jwt.config';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
      JwtModule.registerAsync(jwtConfig.asProvider()),
      ConfigModule.forFeature(jwtConfig),
      TypeOrmModule.forFeature([RolePermission, Role, Permission]),
      RolesModule,
    ],
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService],
  exports: [RolePermissionsService],
})
export class RolePermissionsModule {}
