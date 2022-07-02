import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Promo } from 'src/entities/promo.entity';
import { UUIDValidationPipe } from 'src/modules/support/pipes/uuid-validation.pipe';
import { GetPromo } from './get-promo.decorator';
import { PromoService } from './promo.service';
import RoleGuard from '../auth/guard/roles.guard';
import Role from 'src/entities/roles.enum';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreatePromoDto } from './dto/create-promo.dto';
import { extname } from 'path';
import { UpdatePromoDto } from './dto/update-promo.dto';

@ApiTags('Promo')
@Controller('promo')
export class PromoController {
  constructor(private promoService: PromoService) {}

  @Get()
  getAllPromo(@GetPromo() promo: Promo) {
    return this.promoService.getAllPromo();
  }

  @Get('/:id')
  getPromoById(@Param('id', UUIDValidationPipe) id: string): Promise<Promo> {
    return this.promoService.getPromoById(id);
  }  

  @Post('buat-promo')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('gambar', {
      storage: diskStorage({
        destination: './uploads/promo',
        filename: (req: any, file, cb) => {
          const namafile = [req.user.id, Date.now()].join('-');
          cb(null, namafile + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePromoDto })
  async createBerita(
    @Body() payload: CreatePromoDto,
    @UploadedFile() gambar: Express.Multer.File,
    @Request() req,
  ) {
    payload.gambar = gambar.filename;
    return this.promoService.createPromo(payload, req.user.admin);
  }

  @Put('update-promo/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('gambar', {
      storage: diskStorage({
        destination: './uploads/promo',
        filename: (req: any, file, cb) => {
          const namafile = [req.user.id, Date.now()].join('-');
          cb(null, namafile + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePromoDto })
  async updateBerita(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: UpdatePromoDto,
    @UploadedFile() gambar: Express.Multer.File,
  ): Promise<void> {
    if (gambar) {
      payload.gambar = gambar.filename;
    }
    return this.promoService.updatePromo(id, payload);
  }

  @Delete('/:id')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void> {
    return this.promoService.deletePromo(id);
  }
}
