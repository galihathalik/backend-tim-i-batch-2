import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class updateUserDto{
    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty()
    @IsOptional()
    num_phone: string;

    @ApiProperty()
    @IsOptional()
    NamaLengkap: string;

    @ApiProperty({format:'binary'})
    @IsOptional()
    Foto: string;

}