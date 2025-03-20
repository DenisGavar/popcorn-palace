import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the showtime associated with the booking',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  showtimeId: number;

  @ApiProperty({ example: 15, description: 'The seat number for the booking' })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  seatNumber: number;

  @ApiProperty({
    example: '84438967-f68f-4fa0-b620-0f08217e76af',
    description: 'The unique identifier of the user making the booking',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
