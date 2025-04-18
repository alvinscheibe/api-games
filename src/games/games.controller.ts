import { Controller, Get, Inject, Param, Query, UseInterceptors } from '@nestjs/common';
import { GamesService } from './games.service';
import { CACHE_MANAGER, CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300)
  @Get('search')
  async search(@Query('title') title: string) {
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    const key = `games-search-${slug}`;
    const cachedValue = await this.cacheManager.get(key);

    if (cachedValue) return cachedValue;

    const games = await this.gamesService.search({ title });

    await this.cacheManager.set(key, games);

    return games;
  }

  @Get()
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    
    return await this.gamesService.getAll(pageNumber, limitNumber);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const key = `game-${id}`;
    const cachedValue = await this.cacheManager.get(key);

    if (cachedValue) return cachedValue;

    const game = await this.gamesService.findById({ id });

    await this.cacheManager.set(key, game);

    return game;
  }
}
