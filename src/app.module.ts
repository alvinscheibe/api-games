import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [GamesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
