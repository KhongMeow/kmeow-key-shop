import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/identity/config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([Role]),
    RolesModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
