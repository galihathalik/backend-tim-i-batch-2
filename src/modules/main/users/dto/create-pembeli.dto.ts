import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreatePembeliDto {
  @ApiProperty()
  @IsOptional()
  NamaLengkap: string;

  @ApiProperty({ format: 'binary' })
  @IsOptional()
  FotoProfil: string;
}
