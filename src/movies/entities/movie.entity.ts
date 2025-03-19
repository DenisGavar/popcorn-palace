import { Movie } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MovieEntity implements Movie {
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

  @ApiProperty({
    example: '2025-02-14T14:47:46.125Z',
    description: 'The date and time when the movie record was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-02-15T10:20:30.456Z',
    description: 'The date and time when the movie record was last updated',
  })
  updatedAt: Date;
}
