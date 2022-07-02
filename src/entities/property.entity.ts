import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Admin } from './admin.entity';
import { Pembeli } from './pembeli.entity';
import { User } from './users.entity';

@Entity()
export class Property extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pembeli, (pembeli) => pembeli.id)
  @JoinColumn()
  pembeli: Pembeli;

  @Column()
  tujuan: string;

  @Column()
  tipe: string;

  @Column()
  lokasi: string;

  @Column()
  luasBangunan: string;

  @Column()
  hargaTotal: string;

  @Column()
  jumlahKamarTidur: string;

  @Column()
  jumlahKamarMandi: string;

  @Column()
  judul: string;

  @Column()
  deskripsi: string;

  @Column()
  alamatEmail: string;

  @Column()
  nomorHP: string;

  @Column()
  isi: string;

  @Column()
  gambar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
