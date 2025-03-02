import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private readonly permissionsRepository: Repository<Permission>){}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    try {
      const permission = new Permission();
      permission.name = createPermissionDto.name;
      permission.slug = this.convertToSlug(permission.name)

      return await this.permissionsRepository.save(permission);
    } catch (error) {
      throw new BadRequestException(`Failed to create permission: ${error.message}`)
    }
  }

  async findAll(): Promise<Permission[]> {
    try {
      return await this.permissionsRepository.find();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch permissions: ${error.message}`)
    }
  }

  async findOne(id: number): Promise<Permission> {
    try {
      const permission = await this.permissionsRepository.findOneBy({ id });
      
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`)
      }

      return permission;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch permission: ${error.message}`)
    }
  }

  async findOneBySlug(slug: string): Promise<Permission> {
    const permission = await this.permissionsRepository.findOneBy({ slug });
    if (!permission) {
      throw new NotFoundException(`Permission with slug "${slug}" not found`);
    }
    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      const permission = await this.permissionsRepository.findOne({ where: { id } });
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }
      
      await this.IsExists(permission.name);

      if (updatePermissionDto.name) {
        permission.name = updatePermissionDto.name;
        permission.slug = this.convertToSlug(updatePermissionDto.name);
      }

      return await this.permissionsRepository.save(permission);
    } catch (error) {
      throw new BadRequestException(`Failed to update permission: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const permission = await this.permissionsRepository.findOne({ where: { id }, relations: ['rolePermissions'] });
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      if (permission.rolePermissions && permission.rolePermissions.length > 0) {
        throw new BadRequestException(`Cannot delete permission with ID ${id} because it is being used by ${permission.rolePermissions.length} role permission(s).`);
      }

      await this.permissionsRepository.remove(permission);
    } catch (error) {
      throw new BadRequestException(`Failed to remove permission: ${error.message}`);
    }
  }

  private async IsExists(name: string): Promise<void> {
      const IsExists = await this.permissionsRepository.findOne({ 
        where: [
          { name },
          { slug: this.convertToSlug(name) }
        ],
      });
    
      if (IsExists) {
        throw new ConflictException('Permission with the same name already exists');
      }
    }
    
    private convertToSlug(name: string): string {
      return name.toLowerCase().replace(' ', '-');
    }
}
