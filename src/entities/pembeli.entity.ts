import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/entities/users.entity';
import { Property } from './property.entity';
import { userInfo } from 'os';

@Entity()
export class Pembeli extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => Property, (property) => property.pembeli)
  property: Property;

  @Column({ nullable: true })
  NamaLengkap: string;

  @Column({ nullable: true })
  FotoProfil: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
