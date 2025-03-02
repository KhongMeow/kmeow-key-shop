import { Permission } from "src/permissions/entities/permission.entity";
import { Role } from "src/roles/entities/role.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RolePermission {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Role, (role) => role.id)
    role: Role;

    @ManyToOne(() => Permission, (permission) => permission.id)
    permission: Permission;
}
