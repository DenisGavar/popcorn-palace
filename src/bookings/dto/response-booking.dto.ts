import { ApiProperty } from '@nestjs/swagger';

export class ResponseBookingDto {
  @ApiProperty({
    example: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae',
    description: 'The unique identifier of the booking',
  })
  bookingId: string;
}
