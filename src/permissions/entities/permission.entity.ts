import { RolePermission } from "src/role-permissions/entities/role-permission.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;

	@Column({ unique: true })
	slug: string;

	@OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
	rolePermissions: RolePermission[];
}
