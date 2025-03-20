import { Booking } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class BookingEntity implements Booking {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the booking',
  })
  id: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the showtime associated with the booking',
  })
  showtimeId: number;

  @ApiProperty({ example: 15, description: 'The seat number for the booking' })
  seatNumber: number;

  @ApiProperty({
    example: '84438967-f68f-4fa0-b620-0f08217e76af',
    description: 'The unique identifier of the user making the booking',
  })
  userId: string;

  @ApiProperty({
    example: '2025-02-14T14:47:46.125Z',
    description: 'The date and time when the booking record was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-02-15T10:20:30.456Z',
    description: 'The date and time when the booking record was last updated',
  })
  updatedAt: Date;
}
