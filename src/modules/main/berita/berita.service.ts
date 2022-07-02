import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { identity } from 'rxjs';
import { Property } from 'src/entities/property.entity';
import { User } from 'src/entities/users.entity';
import { CreatePropertyDto } from './dto/create-berita.dto';
import { BeritaRepository } from './repository/berita.repository';

@Injectable()
export class BeritaService {
  constructor(
    @InjectRepository(BeritaRepository)
    private beritaRepository: BeritaRepository,
  ) {}

  async getAllBerita(): Promise<Property[]> {
    return await this.beritaRepository.getAllBerita();
  }

  async getBeritaById(id: string): Promise<Property> {
    const berita = await this.beritaRepository.findOne(id);
    if (!berita) {
      throw new NotFoundException(`Berita dengan id ${id} tidak ditemukan`);
    }
    return berita;
  }

  async createBerita(createBeritaDto: CreatePropertyDto, @Request() req) {
    const berita = await this.beritaRepository.createBerita(
      createBeritaDto,
      req,
    );
    if (berita) {
      return {
        status: 201,
        message: 'Berhasil Membuat Iklan Property',
        data: {
          id: berita.id,
          tujuan: berita.tujuan,
          tipe: berita.tipe,
          lokasi: berita.lokasi,
          luasBangunan: berita.luasBangunan,
          hargaTotal: berita.hargaTotal,
          jumlahKamarTidur: berita.jumlahKamarMandi,
          jumlahKamarMandi: berita.jumlahKamarTidur,
          judul: berita.judul,
          deskripsi: berita.deskripsi,
          alamatEmail: berita.alamatEmail,
          nomorHP: berita.nomorHP,
          isi: berita.isi,
          gambar: berita.gambar,
          by_user: berita.pembeli.NamaLengkap,
        },
      };
    } else {
      return {
        status: 400,
        message: 'Error',
        data: null,
      };
    }
  }

  async updateBerita(id: string, UpdateBeritaDto): Promise<void> {
    const {
      judul,
      isi,
      gambar,
      tujuan,
      tipe,
      lokasi,
      luasBangunan,
      hargaTotal,
      jumlahKamarMandi,
      jumlahKamarTidur,
      deskripsi,
      alamatEmail,
      nomorHP,
    } = UpdateBeritaDto;
    const berita = await this.getBeritaById(id);
    berita.tujuan = tujuan;
    berita.tipe = tipe;
    berita.lokasi = lokasi;
    berita.luasBangunan = luasBangunan;
    berita.hargaTotal = hargaTotal;
    berita.jumlahKamarMandi = jumlahKamarMandi;
    berita.jumlahKamarTidur = jumlahKamarTidur;
    berita.deskripsi = deskripsi;
    berita.alamatEmail = alamatEmail;
    berita.nomorHP = nomorHP;
    berita.judul = judul;
    berita.isi = isi;
    berita.gambar = gambar;
    await berita.save();
  }

  async deleteBerita(id: string): Promise<void> {
    const result = await this.beritaRepository.delete(id);
    if (result.affected == 0) {
      throw new NotFoundException(`Berita dengan id ${id} tidak ditemukan`);
    }
  }
}
