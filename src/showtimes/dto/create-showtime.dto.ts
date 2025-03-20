import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, IsString, IsDate } from 'class-validator';

export class CreateShowtimeDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the movie associated with this showtime',
  })
  @IsInt()
  @IsPositive()
  movieId: number;

  @ApiProperty({ example: 20.2, description: 'The price of the showtime' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 'Sample Theater',
    description: 'The theater where the movie is shown',
  })
  @IsString()
  theater: string;

  @ApiProperty({
    example: '2025-02-14T11:47:46.125405Z',
    description: 'The start time of the showtime',
  })
  @IsDate()
  startTime: Date;

  @ApiProperty({
    example: '2025-02-14T14:47:46.125405Z',
    description: 'The end time of the showtime',
  })
  @IsDate()
  endTime: Date;
}
