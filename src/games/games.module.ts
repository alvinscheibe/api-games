import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RawgService } from 'src/rawg/rawg.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, PrismaService, RawgService],
})
export class GamesModule {}
