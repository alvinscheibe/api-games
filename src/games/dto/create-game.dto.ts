import { IsString, IsNotEmpty, IsArray, IsDateString, IsNumber } from 'class-validator';

export class CreateGameDto {
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
