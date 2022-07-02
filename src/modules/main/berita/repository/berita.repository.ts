import { InternalServerErrorException, Request } from '@nestjs/common';
import { Admin } from 'src/entities/admin.entity';
import { Property } from 'src/entities/property.entity';
import { User } from 'src/entities/users.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePropertyDto } from '../dto/create-berita.dto';

@EntityRepository(Property)
export class BeritaRepository extends Repository<Property> {
  async getAllBerita(): Promise<Property[]> {
    const query = this.createQueryBuilder('berita');
    return await query.getMany();
  }
 
  async createBerita(
    createBeritaDto: CreatePropertyDto,
    @Request() req,
  ): Promise<Property> {
    const {
      judul,
      isi,
      gambar,
      tipe,
      tujuan,
      lokasi,
      luasBangunan,
      hargaTotal,
      jumlahKamarMandi,
      jumlahKamarTidur,
      deskripsi,
      alamatEmail,
      nomorHP,
    } = createBeritaDto;

    const berita = this.create();
    berita.pembeli = req;
    berita.judul = judul;
    berita.isi = isi;
    berita.gambar = gambar;
    berita.tipe = tipe;
    berita.tujuan = tujuan;
    berita.lokasi = lokasi;
    berita.luasBangunan = luasBangunan;
    berita.hargaTotal = hargaTotal;
    berita.jumlahKamarMandi = jumlahKamarMandi;
    berita.jumlahKamarTidur = jumlahKamarTidur;
    berita.deskripsi = deskripsi;
    berita.alamatEmail = alamatEmail;
    berita.nomorHP = nomorHP;

    try {
      return await berita.save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
} 
