import { Role } from "src/roles/entities/role.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @ManyToOne(() => Role, (role) => role.id)
    role: Role;
}
