import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/identity/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    RolesModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
