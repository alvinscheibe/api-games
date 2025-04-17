import { Controller, Get, Param, Query } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('search')
  async search(@Query('title') title: string) {
    return await this.gamesService.search({ title });
  }

  @Get()
  async getAll() {
    return await this.gamesService.getAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.gamesService.findById({ id });
  }
}
