import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { log } from 'console';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly rolesRepository: Repository<Role>) {}
  
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      await this.IsExists(createRoleDto.name);
      
      const role = new Role();
      role.name = createRoleDto.name;
      role.slug = this.convertToSlug(createRoleDto.name);

      return await this.rolesRepository.save(role);
    } catch (error) {
      throw new BadRequestException(`Failed to create role: ${error.message}`);
    }
  }

  async findAll(page?: number, limit?: number, orderBy?: string, direction?: string): Promise<Role[]> {
    try {
      const skip = page && limit ? (page - 1) * limit : undefined;
      const take = limit ?? undefined;

      const roles = await this.rolesRepository.find({
        relations: ['rolePermissions.role', 'rolePermissions.permission'],
        skip,
        take,
        order: {
          [orderBy || 'id']: direction || 'ASC',
        },
      });
      if (!roles || roles.length === 0) {
        throw new NotFoundException(`Roles is empty`);
      }

      return roles;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch roles: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Role> {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id },
        relations: ['rolePermissions.role', 'rolePermissions.permission'],
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return role;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch role: ${error.message}`);
    }
  }

  async findOneBySlug(slug: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({ 
      where: { slug },
      relations: ['rolePermissions.role', 'rolePermissions.permission'],
     });
    if (!role) {
      throw new NotFoundException(`Role with slug "${slug}" not found`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.rolesRepository.findOne({ where: { id } });
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      
      await this.IsExists(role.name);

      if (updateRoleDto.name) {
        role.name = updateRoleDto.name;
        role.slug = this.convertToSlug(updateRoleDto.name);
      }

      return await this.rolesRepository.save(role);
    } catch (error) {
      throw new BadRequestException(`Failed to update role: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const role = await this.rolesRepository.findOne({ where: { id }, relations: ['users'] });
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      if (role.users && role.users.length > 0) {
        throw new BadRequestException(`Cannot delete role with ID ${id} because it is being used by ${role.users.length} user(s).`);
      }
      
      await this.rolesRepository.remove(role);
    } catch (error) {
      throw new BadRequestException(`Failed to remove role: ${error.message}`);
    }
  }

  private async IsExists(name: string): Promise<void> {
    const IsExists = await this.rolesRepository.findOne({ 
      where: [
        { name },
        { slug: this.convertToSlug(name) }
      ],
    });
  
    if (IsExists) {
      throw new ConflictException('Role with the same name already exists');
    }
  }
  
  private convertToSlug(name: string): string {
    return name.toLowerCase().replace(' ', '-');
  }
}
