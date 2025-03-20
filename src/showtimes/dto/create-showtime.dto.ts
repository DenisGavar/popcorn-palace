import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

export class CreateShowtimeDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the movie associated with this showtime',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  movieId: number;

  @ApiProperty({ example: 20.2, description: 'The price of the showtime' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 'Sample Theater',
    description: 'The theater where the movie is shown',
  })
  @IsNotEmpty()
  @IsString()
  theater: string;

  @ApiProperty({
    example: '2025-02-14T11:47:46.125405Z',
    description: 'The start time of the showtime',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    example: '2025-02-14T14:47:46.125405Z',
    description: 'The end time of the showtime',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;
}
