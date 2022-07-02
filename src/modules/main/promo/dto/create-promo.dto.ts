import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePromoDto {
  @ApiProperty()
  @IsNotEmpty()
  nama: string;

  @ApiProperty()
  @IsNotEmpty()
  keterangan: string;

  @ApiProperty({ format: 'binary' })
  @IsOptional()
  gambar: string;
}
