import { IsEmail, IsString, MinLength } from "class-validator";
import { Role } from "src/roles/entities/role.entity";

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  role: Role;
}
