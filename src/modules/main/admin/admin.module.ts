import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from '../users/repository/admin.repository';
import { PembeliRepository } from '../users/repository/pembeli.repository';
import { UserRepository } from '../users/repository/users.repository';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      PembeliRepository,
      AdminRepository,
    ]),
    AdminModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
