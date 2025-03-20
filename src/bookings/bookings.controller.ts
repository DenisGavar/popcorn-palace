import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { BookingEntity } from './entities/booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: BookingEntity })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return new BookingEntity(
      await this.bookingsService.create(createBookingDto),
    );
  }
}
