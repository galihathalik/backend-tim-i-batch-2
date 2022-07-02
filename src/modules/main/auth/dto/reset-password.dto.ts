import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  password_confirmation: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}