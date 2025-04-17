import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 60 * 60,
    }),
    GamesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
