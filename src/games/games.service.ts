import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game, Prisma } from '@prisma/client';
import { RawgService } from 'src/rawg/rawg.service';

@Injectable()
export class GamesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly rawgService: RawgService,
  ) {}

  async search({ title }: { title: string }) {
    let games = await this.prismaService.game.findMany({
      where: {
        title: {
          contains: title,
        },
      },
    });

    const gamesData: Prisma.GameCreateInput[] = [];

    if (!games.length) {
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

      await this.prismaService.game.createMany({ data: gamesData });
    }

    if (gamesData.length) {
      games = await this.prismaService.game.findMany({
        where: {
          title: {
            contains: title,
          },
        },
      });
    }

    return games;
  }

  async getAll() {
    return await this.prismaService.game.findMany();
  }

  async findById({ id }: { id: string }) {
    return await this.prismaService.game.findUnique({
      where: {
        id,
      },
    });
  }
}
