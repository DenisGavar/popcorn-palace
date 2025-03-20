import { Movie } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class MovieEntity implements Movie {
  constructor(partial: Partial<MovieEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the movie',
  })
  id: number;

  @ApiProperty({
    example: 'The Lord of the Rings: The Fellowship of the Ring',
    description: 'The title of the movie',
  })
  title: string;

  @ApiProperty({ example: 'Fantasy', description: 'The genre of the movie' })
  genre: string;

  @ApiProperty({
    example: 178,
    description: 'The duration of the movie in minutes',
  })
  duration: number;

  @ApiProperty({ example: 8.9, description: 'The rating of the movie' })
  rating: number;

  @ApiProperty({ example: 2001, description: 'The release year of the movie' })
  releaseYear: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
