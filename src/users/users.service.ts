import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/identity/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/identity/config/jwt.config';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Repository } from 'typeorm';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      user.username = createUserDto.username;
      user.email = createUserDto.email;
      user.password = await this.hashingService.hash(createUserDto.password);
      user.role = createUserDto.role;
    
      return await this.usersRepository.save(user);
    } catch (error) {
      const pgUniqueViolation = '23505';
      if (error.code === pgUniqueViolation) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  findAll() {
    try {
      const users = this.usersRepository.find({
        relations: ['role'],
      });

      return users;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch users: ${error.message}`);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
