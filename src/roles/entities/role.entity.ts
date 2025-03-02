import { Permission } from "src/permissions/entities/permission.entity";
import { RolePermission } from "src/role-permissions/entities/role-permission.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({unique: true})
    slug: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    rolePermissions: RolePermission[];
}
