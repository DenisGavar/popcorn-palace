import { Booking } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class BookingEntity implements Booking {
  @ApiProperty({
    example: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae',
    description: 'The unique identifier of the booking',
    name: 'bookingId',
  })
  id: string;

  showtimeId: number;

  seatNumber: number;

  userId: string;

  createdAt: Date;

  updatedAt: Date;
}
