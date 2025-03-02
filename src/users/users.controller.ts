import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/identity/authentication/decorators/auth.decorator';
import { AuthType } from 'src/identity/authentication/enums/auth-type.enum';
import { PermissionsGuard } from 'src/identity/authorization/guards/permissions/permissions.guard';
import { Permissions } from 'src/identity/authorization/decorators/permissions.decorator';

@Auth(AuthType.None)
@UseGuards(PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions('create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permissions('read-user')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('read-user')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('update-user')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Permissions('detele-user')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
