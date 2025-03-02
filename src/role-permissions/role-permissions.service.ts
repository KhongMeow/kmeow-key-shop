import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Repository } from 'typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { IsEmpty } from 'class-validator';

@Injectable()
export class RolePermissionsService {
  constructor (
    @InjectRepository(RolePermission) private readonly rolePermissionsRepository: Repository<RolePermission>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionsRepository: Repository<Permission>
  ) {}

  async create(createRolePermissionDto: CreateRolePermissionDto) {
    try {
      await this.IsExists(createRolePermissionDto.roleId, createRolePermissionDto.permissionId);

      const rolePermission = new RolePermission();
      const role = await this.rolesRepository.findOneBy({ id: createRolePermissionDto.roleId });
      const permission = await this.permissionsRepository.findOneBy({ id: createRolePermissionDto.permissionId });

      if (!role || !permission) {
        throw new BadRequestException('Role or Permission not found');
      }

      rolePermission.role = role;
      rolePermission.permission = permission;

      return await this.rolePermissionsRepository.save(rolePermission);
    } catch (error) {
      throw new BadRequestException(`Failed to create role-permission: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const rolePermission = await this.rolePermissionsRepository.find({
        relations: ['role', 'permission'],
      });

      if (!rolePermission) {
        throw new NotFoundException('Failed to fetch role-permissions');
      }

      return rolePermission;
    } catch (error) {
      throw new NotFoundException('Failed to fetch role-permissions');
    }
  }

  async findOne(id: number) {
    try {
      const rolePermission = await this.rolePermissionsRepository.findOne({
        where: { id },
        relations: ['role', 'permission'],
      });

      if (!rolePermission) {
        throw new NotFoundException('Failed to fetch role-permissions');
      }

      return rolePermission;
    } catch (error) {
      throw new NotFoundException('Failed to fetch role-permissions');
    }
  }

  async update(id: number, updateRolePermissionDto: UpdateRolePermissionDto) {
    try {
      const rolePermission = await this.findOne(id);
      
      const { roleId, permissionId } = updateRolePermissionDto;

      if (roleId === undefined && permissionId === undefined) {
        throw new BadRequestException('RoleId or PermissionId must be provided');
      }

      const effectiveRoleId = roleId !== undefined ? roleId : rolePermission.role.id;
      const effectivePermissionId = permissionId !== undefined ? permissionId : rolePermission.permission.id;

      await this.IsExists(effectiveRoleId, effectivePermissionId);

      const role = await this.rolesRepository.findOneBy({ id: effectiveRoleId });
      const permission = await this.permissionsRepository.findOneBy({ id: effectivePermissionId });

      if (!role || !permission) {
        throw new BadRequestException('Role or Permission not found');
      }

      rolePermission.role = role;
      rolePermission.permission = permission;
      
      return await this.rolePermissionsRepository.save(rolePermission);
    } catch (error) {
      throw new BadRequestException(`Failed to update role-permission: ${error.message}`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} rolePermission`;
  }

  private async IsExists(roleId: number, permissionId: number): Promise<void> {
    const role = await this.rolesRepository.findOneBy({ id: roleId });
    const permission = await this.permissionsRepository.findOneBy({ id: permissionId });

    if (!role || !permission) {
      throw new BadRequestException('Role or Permission not found');
    }

    const IsExists = await this.rolePermissionsRepository.findOneBy({ 
      role,
      permission
    });
    
    if (IsExists) {
      throw new ConflictException('Role-permission with the same role and permission already exists');
    }
  }
}
