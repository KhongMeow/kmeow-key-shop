import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class SignInDto {
  @IsString()
  usernameOrEmail: string;

  @MinLength(8)
  password: string;
}
