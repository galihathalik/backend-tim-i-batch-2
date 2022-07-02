import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePropertyDto {
  @ApiProperty()
  @IsOptional()
  tujuan: string;

  @ApiProperty()
  @IsOptional()
  tipe: string;

  @IsOptional()
  lokasi: string;

  @IsOptional()
  luasBangunan: string;

  @IsOptional()
  hargaTotal: string;

  @IsOptional()
  jumlahKamarTidur: string;

  @IsOptional()
  jumlahKamarMandi: string;

  @ApiProperty()
  @IsOptional()
  judul: string;

  @IsOptional()
  deskripsi: string;

  @IsOptional()
  alamatEmail: string;

  @IsOptional()
  nomorHP: string;

  @ApiProperty()
  @IsOptional()
  isi: string;

  @ApiProperty({ format: 'binary' })
  @IsOptional()
  gambar: string;
}
