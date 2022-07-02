import {
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { query } from 'express';
import { filter } from 'rxjs';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { Duplex } from 'stream';
import { CreatePembeliDto } from '../dto/create-pembeli.dto';
import { PembeliRepository } from './pembeli.repository';
import { AdminRepository } from './admin.repository';
import { FilterUserDto } from '../dto/filter-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly pembeliRepo: PembeliRepository;
  private readonly adminRepo: AdminRepository;

  async getAllUser(): Promise<User[]> {
    const query = this.createQueryBuilder('user');
    return await query.getMany();
  }

  async filterUsers(filter: FilterUserDto): Promise<User[]> {
    const { role } = filter;
    const query = this.createQueryBuilder('user');
    if (role) {
      query.andWhere(`lower(user.role) LIKE: role`, {
        role: `%${role.toLowerCase()}%`,
      });
    }

    return await query.getMany();
  }

  async registerPembeli(createUserDto: CreateUserDto, role) {
    const { username, password, email, num_phone } = createUserDto;

    const user = this.create();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    user.email = email;
    user.role = role;
    user.num_phone = num_phone;

    const checkEmail = await this.findOne({ where: { email: user.email } });
    if (checkEmail) {
      throw new ConflictException(`Email ${email} Already Used`);
    } else {
      const checkUsername = await this.findOne({
        where: { username: user.username },
      });
      if (checkUsername) {
        throw new ConflictException(`Username ${username} Already Used`);
      } else {
        try {
          return await user.save();
        } catch (e) {
          throw new InternalServerErrorException(e);
        }
      }
    }
  }

  async registerAdmin(createUserDto: CreateUserDto, role) {
    const { username, password, email, num_phone } = createUserDto;

    const user = this.create();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    user.email = email;
    user.role = role;
    user.num_phone = num_phone;

    const checkEmail = await this.findOne({ where: { email: user.email } });
    if (checkEmail) {
      throw new ConflictException(`Email ${email} Already Used`);
    } else {
      const checkUsername = await this.findOne({
        where: { username: user.username },
      });
      if (checkUsername) {
        throw new ConflictException(`Username ${username} Already Used`);
      } else {
        try {
          return await user.save();
        } catch (e) {
          throw new InternalServerErrorException(e);
        }
      }
    }
  }

  async validateUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const userEmail = await this.findOne({ email });
    const userUsername = await this.findOne({ username });
    if (userEmail && (await userEmail.validatePassword(password))) {
      return userEmail;
    }

    if (userUsername && (await userUsername.validatePassword(password))) {
      return userUsername;
    }
    return null;
  }
}
