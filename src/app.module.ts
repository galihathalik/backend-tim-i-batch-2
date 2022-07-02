import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/main/users/users.module';
import { AuthModule } from './modules/main/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import AppConfig, { DbConfigMysql, DbConfigRedis } from 'src/config/app.config';
import { User } from './entities/users.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pembeli } from './entities/pembeli.entity';
import { Admin } from './entities/admin.entity';
import { Property } from './entities/property.entity';
import { BeritaModule } from './modules/main/berita/berita.module';
import { PromoModule } from './modules/main/promo/promo.module';
import { Promo } from './entities/promo.entity';
import { Riwayat } from './entities/riwayat.entity';
import { AdminModule } from './modules/main/admin/admin.module';

const dbConfigMysql: DbConfigMysql = AppConfig().db.mysql;
const dbConfigRedis: DbConfigRedis = AppConfig().db.redis;

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: dbConfigMysql.host,
      port: dbConfigMysql.port,
      username: dbConfigMysql.user,
      password: dbConfigMysql.password,
      database: dbConfigMysql.database,
      entities: [User, Admin, Property, Promo, Riwayat, RefreshToken, Pembeli],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    BeritaModule,
    PromoModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
