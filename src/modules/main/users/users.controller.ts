import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  PayloadTooLargeException,
  Post,
  Put,
  Query,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { get } from 'http';
import { title } from 'process';
import { GetUser } from 'src/modules/main/auth/get-user.decorator';
import { JwtGuard } from 'src/modules/main/auth/guard/jwt.guard';
import { UUIDValidationPipe } from 'src/modules/support/pipes/uuid-validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/users.entity';
import { UsersService } from './users.service';
import RoleGuard from 'src/modules/main/auth/guard/roles.guard';
import Role from 'src/entities/roles.enum';
import { CreatePembeliDto } from './dto/create-pembeli.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUser(@GetUser() user: User) {
    return this.usersService.getAllUser();
  }

  @Get('pembeli')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getPembeli(@GetUser() user: User) {
    return this.usersService.getPembeli(); /// blm di ubah
  }

  @Get('pembeli-detail/:id')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getPembeliDetail(@Param('id', UUIDValidationPipe) id: string) {
    return this.usersService.getPembeliDetail(id); //blm di ubha
  }

  @Get('pembeli-profile')
  @UseGuards(RoleGuard(Role.Pembeli))
  @UseGuards(JwtGuard)
  getPembeliProfile(@Request() req) {
    return this.usersService.getPenmbeliProfile(req.user.id); /// belum d ibuah
  }

  @Get('/:id')
  getUser(@Param('id', UUIDValidationPipe) id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Post('register-admin')
  // @UseGuards(RoleGuard(Role.Admin))
  // @UseGuards(JwtGuard)
  async RegisterAdmin(@Body() payload: CreateUserDto) {
    let role = 'Admin';
    return this.usersService.RegisterAdmin(payload, role);
  }

  @Post('register-pembeli')
  async RegisterPenumpang(@Body() createUser: CreateUserDto) {
    let role = 'Pembeli';
    return await this.usersService.RegisterPembeli(createUser, role); ///
  }

  @Put('upload-foto/:id')
  @UseInterceptors(
    FileInterceptor('Foto', {
      storage: diskStorage({
        destination: './uploads/pembeli/profil',
        filename: (req: any, file, cb) => {
          const namafile = [Date.now()].join('-');
          cb(null, namafile + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  async uploadFoto(
    @Param('id', UUIDValidationPipe) id: string,
    @UploadedFile() Foto: Express.Multer.File,
  ) {
    const foto = Foto.filename;
    return this.usersService.uploadFoto(id, foto);
  }

  @Put('account-setup-admin/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('Foto', {
      storage: diskStorage({
        destination: './uploads/admin',
        filename: (req: any, file, cb) => {
          const namafile = [req.user.id, Date.now()].join('-');
          cb(null, namafile + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAdminDto })
  async accountSetupAdmin(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: CreateAdminDto,
    @UploadedFile() Foto: Express.Multer.File,
  ) {
    payload.Foto = Foto.filename;
    return this.usersService.accountSetupAdmin(id, payload);
  }

  @Put('account-setup-pembeli/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('FotoProfil', {
      storage: diskStorage({
        destination: './uploads/pembeli',
        filename: (req: any, file, cb) => {
          const namafile = [req.user.id, Date.now()].join('-');
          cb(null, namafile + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePembeliDto })
  async accountSetupPenumpang(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: CreatePembeliDto,
    @UploadedFile() FotoProfil: Express.Multer.File,
  ) {
    payload.FotoProfil = FotoProfil.filename;
    return this.usersService.accountSetupPembeli(id, payload);
  }

  @Put('update-pembeli/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('FotoProfil', {
      storage: diskStorage({
        destination: './uploads/pembeli',
        filename: (req: any, file, cb) => {
          const namafile = [req.user.id, Date.now()].join('-');
          cb(null, namafile + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: updateUserDto })
  async updatePembeli(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: updateUserDto,
    @UploadedFile() FotoProfil: Express.Multer.File,
  ): Promise<void> {
    if (FotoProfil) {
      payload.Foto = FotoProfil.filename;
    }
    return this.usersService.updatePembeli(id, payload);
  }

  @Delete('delete-user/:id')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Get('confirm/:id')
  async confirmEmail(@Param('id', UUIDValidationPipe) id: string) {
    const user = await this.usersService.getUserById(id);
    const userEmail = user.email;
    await this.usersService.confirmEmail(userEmail);
  }
}
