import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from '../users/repository/admin.repository';
import { PembeliRepository } from '../users/repository/pembeli.repository';
import { BeritaController } from './berita.controller';
import { BeritaService } from './berita.service';
import { BeritaRepository } from './repository/berita.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BeritaRepository, AdminRepository]),
    BeritaModule,
    PembeliRepository,
  ],
  controllers: [BeritaController],
  providers: [BeritaService],
  exports: [BeritaService],
})
export class BeritaModule {}
