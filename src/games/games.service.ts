import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RawgService } from 'src/rawg/rawg.service';

@Injectable()
export class GamesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly rawgService: RawgService,
  ) {}

  async search({ title }: { title: string }) {
    let gamesFromDB = await this.prismaService.game.findMany({
      where: {
        title: {
          contains: title,
        },
      },
    });

    if (gamesFromDB.length) return gamesFromDB;

    const gamesData = await this.getGamesFromRawg(title);

    await this.prismaService.game.createMany({ data: gamesData });

    if (gamesData.length)
      gamesFromDB = await this.prismaService.game.findMany({
        where: {
          title: {
            contains: title,
          },
        },
      });

    return gamesFromDB;
  }

  async getAll() {
    return await this.prismaService.game.findMany();
  }

  async findById({ id }: { id: string }) {
    const game = await this.prismaService.game.findUnique({
      where: {
        id,
      },
    });

    return game;
  }

  private async getGamesFromRawg(title: string) {
    const gamesData: Prisma.GameCreateInput[] = [];

    const rawgGames = await this.rawgService.getListGames({ search: title });

    rawgGames.forEach((game) => {
      const gameData: Prisma.GameCreateInput = {
        externalId: game.id.toString(),
        title: game.name,
        description: game.name,
        platforms: game.platforms.map((platform) => platform.platform.name),
        releaseDate: game.released,
        rating: game.rating,
        coverImage: game.background_image,
      };

      gamesData.push(gameData);
    });

    return gamesData;
  }
}
