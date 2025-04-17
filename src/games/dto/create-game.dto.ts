import { IsString, IsNotEmpty, IsArray, IsDateString, IsNumber } from 'class-validator';
import { Game } from 'src/games/entities/game.entity';

export class CreateGameDto extends Game {
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  platforms: string[];

  @IsDateString()
  releaseDate: string;

  @IsNumber()
  rating: number;

  @IsString()
  coverImage: string;
}
