import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoController } from './promo.controller';
import { PromoService } from './promo.service';
import { PromoRepository } from './repository/promo.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PromoRepository]),
    PromoModule,
  ],
  controllers: [PromoController],
  providers: [PromoService],
  exports: [PromoService]
})
export class PromoModule {}
 