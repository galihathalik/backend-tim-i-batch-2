import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsOptional()
    email: string;

    @ApiProperty()
    @IsOptional()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}