import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ResponseBookingDto } from './dto/response-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: ResponseBookingDto })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }
}
