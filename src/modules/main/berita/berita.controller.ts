import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import Role from 'src/entities/roles.enum';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { BeritaService } from './berita.service';
import RoleGuard from '../auth/guard/roles.guard';
import { GetProperty } from './get-berita.decorator';
import { Property } from 'src/entities/property.entity';
import { CreatePropertyDto } from './dto/create-berita.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { UUIDValidationPipe } from 'src/modules/support/pipes/uuid-validation.pipe';
import { UpdatePropertyDto } from './dto/update-berita.dto';
import { User } from 'src/entities/users.entity';

@ApiTags('Property')
@Controller('Property')
export class BeritaController {
  constructor(private beritaService: BeritaService) {}

  // @Get('test')
  // @UseGuards(RoleGuard(Role.Admin))
  // @UseGuards(JwtGuard)
  // getTest(@Request() req){
  //     return req.user.admin.id;
  // }

  @Get()
  getAllProperty(@GetProperty() berita: Property) {
    return this.beritaService.getAllBerita();
  }

  @Get('/:id')
  getBeritaById(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<Property> {
    return this.beritaService.getBeritaById(id);
  }

  @Post('buat-property')
  @UseGuards(RoleGuard(Role.Pembeli))
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('gambar', {
      storage: diskStorage({
        destination: './uploads/property',
        filename: (req: any, file, cb) => {
          const namafile = [req.user.id, Date.now()].join('-');
          cb(null, namafile + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePropertyDto })
  async createBerita(
    @Body() payload: CreatePropertyDto,
    @UploadedFile() gambar: Express.Multer.File,
    @Request() req,
  ) {
    payload.gambar = gambar.filename;
    return this.beritaService.createBerita(payload, req.user.pembeli);
  }

  @Put('update-property/:id')
  @UseGuards(RoleGuard(Role.Pembeli))
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('gambar', {
      storage: diskStorage({
        destination: './uploads/property',
        filename: (req: any, file, cb) => {
          const namafile = [req.user.id, Date.now()].join('-');
          cb(null, namafile + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePropertyDto })
  async updateBerita(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: UpdatePropertyDto,
    @UploadedFile() gambar: Express.Multer.File,
  ): Promise<void> {
    if (gambar) {
      payload.gambar = gambar.filename;
    }
    return this.beritaService.updateBerita(id, payload);
  }

  @Delete('/:id')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void> {
    return this.beritaService.deleteBerita(id);
  }
}
