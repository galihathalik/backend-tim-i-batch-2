import { InternalServerErrorException, Request } from "@nestjs/common";
import { Promo } from "src/entities/promo.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreatePromoDto } from "../dto/create-promo.dto";

@EntityRepository(Promo)
export class PromoRepository extends Repository<Promo>{
    async getAllPromo(): Promise<Promo[]>{
        const query = this.createQueryBuilder('promo');
        return await query.getMany();
    }

    async createPromo(createPromoDto: CreatePromoDto, @Request() req){
        const { nama, keterangan, gambar } = createPromoDto;

        const promo = this.create();
        promo.admin = req;
        promo.nama = nama;
        promo.keterangan = keterangan;
        promo.gambar = gambar;

        try{
            return await promo.save();
        }catch(e){
            throw new InternalServerErrorException(e);
        }
    }
}