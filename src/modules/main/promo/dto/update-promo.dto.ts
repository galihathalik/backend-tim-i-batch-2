import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdatePromoDto{
    @ApiProperty()
    @IsOptional()
    nama: string;

    @ApiProperty()
    @IsOptional()
    keterangan: string;

    @ApiProperty({format:'binary'})
    @IsOptional()
    gambar: string;
}