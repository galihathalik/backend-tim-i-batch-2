import { BeritaModule } from 'src/modules/main/berita/berita.module';
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
import { Property } from './property.entity';
import { Promo } from './promo.entity';
import { User } from './users.entity';

@Entity()
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  // @OneToMany(() => Property, (property) => property.admin)
  // property: Property[];

  @Column({ default: "admin" })
  NamaLengkap: string;

  @Column({ default: "foto" })
  Foto: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
