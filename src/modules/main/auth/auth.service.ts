import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { refrestTokenConfig } from 'src/config/jwt.config';
import { User } from 'src/entities/users.entity';
import { UsersService } from 'src/modules/main/users/users.service';
import { LoginDto } from './dto/login.dto';
import { refreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LoginResponse } from './interface/login-response.interface';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { TokenExpiredError } from 'jsonwebtoken';
import { retry } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async loginAdmin(LoginDto: LoginDto): Promise<LoginResponse> {
    const { username, email, password } = LoginDto;

    const user = await this.usersService.validateUser(
      username,
      email,
      password,
    );
    if (!user) {
      throw new UnauthorizedException(
        'Username atau Email atau Password salah',
      );
    }
    if (user.role != `Admin`) {
      throw new UnauthorizedException('Anda Tidak Memiliki Akses');
    }

    if (user) {
      const valid = this.usersService.compare(password, user.password);
      if (valid) {
        const payload = { email: user.email, sub: user.id };

        const access_token = await this.createAccessToken(user);
        const refresh_token = await this.createRefreshToken(user);

        return {
          status: 201,
          message: `Berhasil Login Sebagai Admin`,
          access_token,
          refresh_token,
          payload: {
            id: payload.sub,
            email: payload.email,
          },
        } as LoginResponse;
      } else {
        throw new UnauthorizedException('Password Tidak Cocok');
      }
    }
  }

  async loginPembeli(LoginDto: LoginDto): Promise<LoginResponse> {
    const { username, email, password } = LoginDto;

    const user = await this.usersService.validateUser(
      username,
      email,
      password,
    );
    if (!user) {
      throw new UnauthorizedException(
        'Username atau Email atau Password salah',
      );
    }
    if (user.role != `Pembeli`) {
      throw new UnauthorizedException('Anda Tidak Memiliki Akses');
    }

    if (user) {
      const valid = this.usersService.compare(password, user.password);
      if (valid) {
        const check = await this.usersService.checkVerifiedEmail(user.email);
        if (check) {
          const payload = { email: user.email, sub: user.id };

          const access_token = await this.createAccessToken(user);
          const refresh_token = await this.createRefreshToken(user);

          return {
            status: 201,
            message: `Berhasil Login Sebagai Penumpang`,
            access_token,
            refresh_token,
            payload: {
              id: payload.sub,
              email: payload.email,
            },
          } as LoginResponse;
        } else {
          throw new UnauthorizedException(
            'Silahkan Cek Email Anda Terlebih Dahulu, Kami telah Mengirimkan Link Verifikasi Ke Email Anda',
          );
        }
      }
    }
  }

  async refreshAccessToken(
    refreshTokenDto: refreshAccessTokenDto,
  ): Promise<{ access_token: string }> {
    const { refresh_token } = refreshTokenDto;
    const payload = await this.decodeToken(refresh_token);
    const refreshToken = await this.refreshTokenRepository.findOne(
      payload.jid,
      { relations: ['user'] },
    );

    if (!refreshToken) {
      throw new UnauthorizedException(`Refresh token is not found`);
    }

    if (refreshToken.isRevoked) {
      throw new UnauthorizedException(`Refresh token has been revoked`);
    }

    const access_token = await this.createAccessToken(refreshToken.user);
    return { access_token };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException(`Refresh Token Is Expired`);
      } else {
        throw new InternalServerErrorException(`Failed To Decode Token`);
      }
    }
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }

  async createRefreshToken(user: User): Promise<string> {
    const refreshToken = await this.refreshTokenRepository.createRefreshToken(
      user,
      +refrestTokenConfig.expiresIn,
    );

    const payload = {
      jid: refreshToken.id,
    };

    const refresh_token = await this.jwtService.signAsync(
      payload,
      refrestTokenConfig,
    );
    return refresh_token;
  }

  async revokeRefreshToken(id: string): Promise<void> {
    const refrestToken = await this.refreshTokenRepository.findOne(id);
    if (!refrestToken) {
      throw new NotFoundException(`Refresh token is not found`);
    }
    refrestToken.isRevoked = true;
    await refrestToken.save();
  }
}
