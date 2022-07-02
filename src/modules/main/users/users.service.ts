import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/users.entity';
import { UserRepository } from './repository/users.repository';
import { JwtService } from '@nestjs/jwt';
import EmailService from 'src/modules/support/email/email.service';
import { jwtConfig } from 'src/config/jwt.config';
import * as bcrypt from 'bcrypt';
import { CreatePembeliDto } from './dto/create-pembeli.dto';
import { PembeliRepository } from './repository/pembeli.repository';
import { AdminRepository } from './repository/admin.repository';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import Role from 'src/entities/roles.enum';
import { Message } from 'twilio/lib/twiml/MessagingResponse';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly adminRepository: AdminRepository,
    private readonly pembeliRepository: PembeliRepository,
  ) {}

  async getAllUser(): Promise<User[]> {
    return await this.userRepository.getAllUser();
  }

  async checkVerifiedEmail(email: string) {
    const verified = await this.userRepository.findOne({ where: { email } });

    if (verified.emailVerified) {
      return true;
    } else {
      return false;
    }
  }

  async EmailHasBeenConfirmed(email: string) {
    return this.userRepository.update(
      { email },
      {
        emailVerified: true,
      },
    );
  }

  async getByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  // async getPenumpang(): Promise<User[]> {
  //   const penumpang = await this.userRepository.createQueryBuilder('user')
  //   .innerJoinAndSelect('user.penumpang', 'penumpang')
  //   .where('user.role = :role',{role: 'penumpang'});
  //   return penumpang.getMany();
  // }

  async getPembeli(): Promise<User[]> {
    const penumpang = await this.userRepository.query(
      'SELECT user.id, user.username, user.email, pembeli.NamaLengkap, pembeli.FotoProfil FROM user INNER JOIN pembeli ON user.id = pembeli.userId',
    );
    return penumpang;
  }

  async getPembeliDetail(id: string): Promise<User> {
    const pembeliDetail = await this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: Role.Pembeli })
      .innerJoinAndSelect('user.pembeli', 'pembeli')
      .where('user.id = :id', { id });
    return pembeliDetail.getOne();
  }

  async getPenmbeliProfile(@Request() req) {
    const pembeliProfile = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: req })
      .innerJoinAndSelect('user.pembeli', 'pembeli');
    return pembeliProfile.getOne();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user.getOne();
  }

  async filterUsers(filter: FilterUserDto): Promise<User[]> {
    return await this.userRepository.filterUsers(filter);
  }

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async RegisterAdmin(createUserDto: CreateUserDto, role) {
    const user = await this.userRepository.registerAdmin(createUserDto, role);
    if (user) {
      const admin = await this.adminRepository.createAdmin(user);
      return {
        status: 201,
        message: 'Success create account',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          num_phone: user.num_phone,
        },
      };
    }
  }

  async RegisterPembeli(createUserDto: CreateUserDto, role) {
    const user = await this.userRepository.registerPembeli(createUserDto, role);
    // const sendLink = await this.sendVerificationLink(user.email, user.id);
    if (user) {
      const penumpang = await this.pembeliRepository.createPembeli(user);
      return {
        status: 201,
        message: 'Success create account',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          num_phone: user.num_phone,
        },
      };
    }
  }

  async uploadFoto(id: string, foto) {
    const user = await this.getUserById(id);
    user.admin.Foto = foto;

    await user.admin.save();
  }

  async accountSetupAdmin(id: string, createAdmin: CreateAdminDto) {
    const { NamaLengkap, Foto } = createAdmin;
    const user = await this.getUserById(id);
    user.admin.NamaLengkap = NamaLengkap;
    user.admin.Foto = Foto;

    await user.admin.save();
  }

  async accountSetupPembeli(id: string, createPembeli: CreatePembeliDto) {
    const { NamaLengkap, FotoProfil } = createPembeli;
    const user = await this.getUserById(id);
    user.pembeli.NamaLengkap = NamaLengkap;
    user.pembeli.FotoProfil = FotoProfil;

    await user.pembeli.save();
  }

  // async accountSetupSopir(id: string, createSopir: CreateSopirDto): Promise<void>{
  //   const { NamaLengkap , Foto } = createSopir;
  //   const user = await this.getUserById(id);
  //   user.sopir.NamaLengkap = NamaLengkap;
  //   user.sopir.Foto = Foto;

  //   await user.sopir.save();
  // }

  async updatePembeli(id: string, updateUserDto): Promise<void> {
    const { email, num_phone, NamaLengkap, foto } = updateUserDto;
    const user = await this.getUserById(id);
    user.email = email;
    user.num_phone = num_phone;
    await user.save();

    user.pembeli.NamaLengkap = NamaLengkap;
    user.pembeli.FotoProfil = foto;
    user.pembeli.save();
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected == 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    // else {
    //   throw new Message(`Berhasil hapus`);
    // }
  }

  async validateUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    return await this.userRepository.validateUser(username, email, password);
  }

  sendVerificationLink(email: string, id: string) {
    const url = `${process.env.EMAIL_CONFIRMATION_URL}${id}`;

    const text = `Selamat datang di aplikasi Ohome360. Untuk Memverifikasi email Anda, klik link berikut: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Verifikasi Email',
      text,
    });
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: 'koderahasia',
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async confirmEmail(email: string) {
    const user = await this.getByEmail(email);
    if (user.emailVerified) {
      throw new BadRequestException('Email already confirmed');
    } else {
      const confirm = await this.EmailHasBeenConfirmed(email);
      return {
        status: 201,
        message: 'Email confirmation successfully',
      };
    }
  }

  async sendEmailForgetPasswordLink(email: string) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new BadRequestException('Email Tidak Ditemukan');
    } else {
      const payload = {
        email: email,
      };
      const token = this.jwtService.sign(payload);
      const url = `${process.env.RESET_PASSWORD_URL}?token=${token}`;
      const text = `Selamat Datang Di Aplikasi Angkotkita. Untuk Mereset Password, Silahkan Klik Link Berikut: ${url}`;

      return this.emailService.sendMail({
        to: email,
        subject: `Reset Password`,
        text,
      });
    }
  }

  async resetPassword(email: string, ResetPasswordDto): Promise<void> {
    const { password } = ResetPasswordDto;

    const user = await this.getByEmail(email);
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    await user.save();
  }

  async hash(plainPassword) {
    const salt = await bcrypt.genSalt();
    const hash = bcrypt.hashSync(plainPassword, parseInt(salt));
    return hash;
  }

  compare(plainPassword, hash) {
    const valid = bcrypt.compareSync(plainPassword, hash);
    return valid;
  }
}
