import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const result = await this.prisma.booking.create({
      data: createBookingDto,
      select: {
        id: true,
      },
    });
    // TODO: I think that I should use Expose() and ClassSerializerInterceptor
    // I tried to use them but I couldn't get the results I wanted
    return { bookingId: result.id };
  }
}
