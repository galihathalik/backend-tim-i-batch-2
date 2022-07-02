import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
    secret: 'koderahasia',
    signOptions: {
        expiresIn: 60,
    },
}

export const refrestTokenConfig: JwtSignOptions = {
    expiresIn: 3600 * 24,
}