import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/modules/main/auth/guard/jwt.guard';
import { User } from 'src/entities/users.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { refreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { GetUser } from './get-user.decorator';
import { LoginResponse } from './interface/login-response.interface';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login-admin')
  async loginAdmin(@Body() LoginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.loginAdmin(LoginDto);
  }

  @Post('login-pembeli')
  async loginPenumpang(@Body() LoginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.loginPembeli(LoginDto);
  }

  @Post('refresh-token')
  async refrestToken(
    @Body() refreshTokenDto: refreshAccessTokenDto,
  ): Promise<{ access_token: string }> {
    return this.authService.refreshAccessToken(refreshTokenDto);
  }

  @Patch('/:id/revoke')
  @UseGuards(JwtGuard)
  async revokeRefreshToken(@Param('id') id: string): Promise<void> {
    return this.authService.revokeRefreshToken(id);
  }

  @Post('forget-password')
  async sendEmailForgetPassword(@Body() body: ForgetPasswordDto) {
    const sendLink = await this.usersService.sendEmailForgetPasswordLink(
      body.email,
    );
    return {
      statuscode: 201,
      message: 'Cek Email Anda Untuk Langkah Selanjutnya',
    };
  }

  @Post('reset-password')
  async resetPassowrd(@Body() body: ResetPasswordDto) {
    const email = await this.usersService.decodeConfirmationToken(body.token);
    return await this.usersService.resetPassword(email, body);
  }
}
