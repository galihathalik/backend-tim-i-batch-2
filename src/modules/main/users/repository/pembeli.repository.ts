import { Pembeli } from 'src/entities/pembeli.entity';
import { User } from 'src/entities/users.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Pembeli)
export class PembeliRepository extends Repository<Pembeli> {
  async createPembeli(user: User) {
    const pembeli = this.create();
    pembeli.user = user;

    return await pembeli.save();
  }
}
