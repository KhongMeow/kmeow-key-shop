import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { PermissionsGuard } from './authorization/guards/permissions/permissions.guard';
import { RolesModule } from 'src/roles/roles.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Role]),
		JwtModule.registerAsync(jwtConfig.asProvider()),
		ConfigModule.forFeature(jwtConfig),
		RolesModule
	],
	providers: [
		{
			provide: HashingService,
			useClass: BcryptService
		},
		{
			provide: APP_GUARD,
			useClass: AuthenticationGuard
		},
		{
			provide: APP_GUARD,
			useClass: PermissionsGuard
		},
		AccessTokenGuard,
		RefreshTokenIdsStorage,
		AuthenticationService,
	],
	controllers: [AuthenticationController],
	exports: [AuthenticationService],
})
export class IdentityModule { }
