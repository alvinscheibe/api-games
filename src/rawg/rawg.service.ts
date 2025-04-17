import { Injectable } from '@nestjs/common';
import { GetListGames } from 'src/rawg/api/get-list-games';

@Injectable()
export class RawgService {
  async getListGames({ search }: { search: string }) {
    let page = 1;
    let games: GameResult[] = [];

    while (true) {
      const result = await this.getGames({ search, page });

      games.push(...result.data.results);

      if (!result.data.next) break;

      page++;
    }

    return games;
  }

  private async getGames({ search, page }: { search: string; page?: number }) {
    const getListGames = new GetListGames({ search, page });
    const rawgApi = await getListGames.send();

    return rawgApi.getResponse<{
      count: number;
      next: string | null;
      previous: string | null;
      results: GameResult[];
    }>();
  }
}

type GameResult = {
  id: number;
  slug: string;
  name: string;
  background_image: string;
  rating: number;
  released: string | null;
  platforms: Array<{
    platform: {
      id: number;
      slug: string;
      name: string;
    };
  }>;
};
