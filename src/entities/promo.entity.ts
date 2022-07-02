import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Admin } from "./admin.entity";

@Entity()
export class Promo extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Admin, (admin) => admin.id)
    @JoinColumn()
    admin: Admin;

    @Column()
    nama: string;

    @Column()
    keterangan: string;

    @Column()
    gambar: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
