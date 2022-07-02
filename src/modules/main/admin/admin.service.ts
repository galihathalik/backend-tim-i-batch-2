import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from '../users/repository/admin.repository';
import { PembeliRepository } from '../users/repository/pembeli.repository';
import { UserRepository } from '../users/repository/users.repository';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserRepository)
    @InjectRepository(PembeliRepository)
    private readonly userRepository: UserRepository,
    private readonly pembeliRepository: PembeliRepository,
  ) {}

  async getData() {
    const getTotalUsers = await this.userRepository.query(
      'SELECT COUNT(*) as totalUser FROM user',
    );

    const getTotalDataPembeli = await this.pembeliRepository.query(
      'SELECT COUNT(*) as totalPembeli FROM pembeli',
    );

    const objResult = {
      message: 'Get Data Success',
      total: {
        user: parseInt(getTotalUsers[0].totalUser),
        penumpang: parseInt(getTotalDataPembeli[0].totalPenumpang),
      },
    };

    return objResult;
  }
}
