import { Booking } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class BookingEntity implements Booking {
  constructor(partial: Partial<BookingEntity>) {
    Object.assign(this, partial);
  }

  @Expose({ name: 'bookingId' })
  @ApiProperty({
    example: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae',
    description: 'The unique identifier of the booking',
    name: 'bookingId',
  })
  id: string;

  @Exclude()
  showtimeId: number;

  @Exclude()
  seatNumber: number;

  @Exclude()
  userId: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
