import { Showtime } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ShowtimeEntity implements Showtime {
  constructor(partial: Partial<ShowtimeEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the showtime',
  })
  id: number;

  @ApiProperty({ example: 20.2, description: 'The price of the showtime' })
  price: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the movie associated with this showtime',
  })
  movieId: number;

  @ApiProperty({
    example: 'Sample Theater',
    description: 'The theater where the movie is shown',
  })
  theater: string;

  @ApiProperty({
    example: '2025-02-14T11:47:46.125Z',
    description: 'The start time of the showtime',
  })
  startTime: Date;

  @ApiProperty({
    example: '2025-02-14T14:47:46.125Z',
    description: 'The end time of the showtime',
  })
  endTime: Date;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
