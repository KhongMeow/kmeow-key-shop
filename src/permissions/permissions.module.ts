import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/identity/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([Permission]),
    RolesModule,
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
