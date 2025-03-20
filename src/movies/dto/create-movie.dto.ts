import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    example: 'The Lord of the Rings: The Fellowship of the Ring',
    description: 'The title of the movie',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Fantasy', description: 'The genre of the movie' })
  @IsNotEmpty()
  @IsString()
  genre: string;

  @ApiProperty({
    example: 178,
    description: 'The duration of the movie in minutes',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  duration: number;

  @ApiProperty({ example: 8.9, description: 'The rating of the movie' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({ example: 2001, description: 'The release year of the movie' })
  @IsNotEmpty()
  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear() + 10)
  releaseYear: number;
}
