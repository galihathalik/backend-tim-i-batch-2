import { User } from "src/entities/users.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshToken extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    isRevoked: boolean;

    @Column()
    expiredAt: Date;

    @ManyToOne(() => User, (user) => user.refreshToken, {onDelete:'CASCADE'})
    user: User;
}