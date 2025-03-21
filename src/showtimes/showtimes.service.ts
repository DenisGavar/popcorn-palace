import { ConflictException, Injectable } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShowtimesService {
  constructor(private prisma: PrismaService) {}

  async create(createShowtimeDto: CreateShowtimeDto) {
    const overlappingShowtimes = await this.prisma.showtime.findMany({
      where: {
        theater: createShowtimeDto.theater,
        startTime: { lte: createShowtimeDto.endTime },
        endTime: { gte: createShowtimeDto.startTime },
      },
    });

    if (overlappingShowtimes.length > 0) {
      throw new ConflictException(
        'Showtime overlaps with existing showtimes in the same theater',
      );
    }

    return this.prisma.showtime.create({ data: createShowtimeDto });
  }

  findOne(id: number) {
    return this.prisma.showtime.findUnique({ where: { id } });
  }

  async update(id: number, updateShowtimeDto: UpdateShowtimeDto) {
    await this.prisma.showtime.update({
      where: { id },
      data: updateShowtimeDto,
    });
  }

  async remove(id: number) {
    await this.prisma.showtime.delete({ where: { id } });
  }
}
