import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  imports: [PrismaModule],
})
export class BookingsModule {}
