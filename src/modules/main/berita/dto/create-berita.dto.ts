import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  tujuan: string;

  @ApiProperty()
  @IsNotEmpty()
  tipe: string;

  @ApiProperty()
  @IsNotEmpty()
  lokasi: string;

  @ApiProperty()
  @IsNotEmpty()
  luasBangunan: string;

  @ApiProperty()
  @IsNotEmpty()
  hargaTotal: string;

  @ApiProperty()
  @IsNotEmpty()
  jumlahKamarTidur: string;

  @ApiProperty()
  @IsNotEmpty()
  jumlahKamarMandi: string;

  @ApiProperty()
  @IsNotEmpty()
  judul: string;

  @ApiProperty()
  @IsNotEmpty()
  deskripsi: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  alamatEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(11)
  nomorHP: string;

  @ApiProperty()
  @IsNotEmpty()
  isi: string;

  @ApiProperty({ format: 'binary' })
  @IsOptional()
  gambar: string;
}
