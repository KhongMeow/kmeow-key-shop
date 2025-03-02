import { IsInt, IsNotEmpty } from "class-validator";

export class CreateRolePermissionDto {
  @IsInt()
  roleId: number;

  @IsInt()
  permissionId: number;
}
