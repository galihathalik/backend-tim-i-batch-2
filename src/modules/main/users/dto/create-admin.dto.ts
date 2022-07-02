import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateAdminDto{
    @ApiProperty()
    @IsOptional()
    NamaLengkap: string;

    @ApiProperty({format:'binary'})
    @IsOptional()
    Foto: string;
}