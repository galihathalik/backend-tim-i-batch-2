import { User } from "src/entities/users.entity";
import { EntityRepository, Repository } from "typeorm";
import { RefreshToken } from "src/entities/refresh-token.entity";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken>{
    async createRefreshToken(user: User, ttl: number): Promise<RefreshToken>{
        const refreshToken = this.create();
        refreshToken.user = user;
        refreshToken.isRevoked = false;
        const expiredAt = new Date();
        expiredAt.setTime(expiredAt.getTime() + ttl);
        refreshToken.expiredAt = expiredAt;

        return await refreshToken.save();
    }
}