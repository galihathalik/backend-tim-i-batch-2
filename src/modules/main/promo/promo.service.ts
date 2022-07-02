import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promo } from 'src/entities/promo.entity';
import { CreatePromoDto } from './dto/create-promo.dto';
import { PromoRepository } from './repository/promo.repository';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(PromoRepository)
    private promoRepository: PromoRepository,
  ) {}

  async getAllPromo(): Promise<Promo[]> {
    return await this.promoRepository.getAllPromo();
  }

  async getPromoById(id: string): Promise<Promo> {
    const promo = await this.promoRepository.findOne(id);
    if (!promo) {
      throw new NotFoundException(`Promo dengan id ${id} tidak ditemukan`);
    }
    return promo;
  }

  async createPromo(createPromoDto: CreatePromoDto, @Request() req) {
    const promo = await this.promoRepository.createPromo(createPromoDto, req);
    if (promo) {
      return {
        status: 201,
        message: 'Success create Promo',
        data: {
          id: promo.id,
          nama: promo.nama,
          keterangan: promo.keterangan,
          gambar: promo.gambar,
          by_admin: promo.admin.NamaLengkap,
        },
      };
    }
  }

  async updatePromo(id: string, UpdatePromoDto): Promise<void> {
    const { nama, keterangan, gambar } = UpdatePromoDto;
    const promo = await this.getPromoById(id);
    promo.nama = nama;
    promo.keterangan = keterangan;
    promo.gambar = gambar;
    await promo.save();
  }

  async deletePromo(id: string): Promise<void> {
    const result = await this.promoRepository.delete(id);
    if (result.affected == 0) {
      throw new NotFoundException(`Promo dengan id ${id} tidak ditemukan`);
    }
  }
}
