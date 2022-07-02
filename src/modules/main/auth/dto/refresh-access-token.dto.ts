import { IsNotEmpty } from 'class-validator';
export class refreshAccessTokenDto{
    @IsNotEmpty()
    refresh_token: string;
}