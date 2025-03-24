import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShowtimesService {
  constructor(private prisma: PrismaService) {}

  async create(createShowtimeDto: CreateShowtimeDto) {
    // search for overlapping showtimes
    const overlappingShowtimes = await this.prisma.showtime.findMany({
      where: {
        theater: createShowtimeDto.theater,
        startTime: { lte: createShowtimeDto.endTime },
        endTime: { gte: createShowtimeDto.startTime },
      },
    });

    // if overlapping showtimes exist - error
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
    // search for an existing showtime
    const showtime = await this.prisma.showtime.findUnique({ where: { id } });

    // check if showtime exists
    if (!showtime) {
      throw new NotFoundException(`Showtime with id: ${id} does not exist.`);
    }

    // fill in the fields, if necessary
    const theater = updateShowtimeDto.theater ?? showtime.theater;
    const startTime = updateShowtimeDto.startTime ?? showtime.startTime;
    const endTime = updateShowtimeDto.endTime ?? showtime.endTime;

    // search for overlapping showtimes
    const overlappingShowtimes = await this.prisma.showtime.findMany({
      where: {
        theater: theater,
        startTime: { lte: endTime },
        endTime: { gte: startTime },
        id: { not: id },
      },
    });

    // if overlapping showtimes exist - error
    if (overlappingShowtimes.length > 0) {
      throw new ConflictException(
        'Showtime overlaps with existing showtimes in the same theater',
      );
    }

    await this.prisma.showtime.update({
      where: { id },
      data: updateShowtimeDto,
    });
  }

  async remove(id: number) {
    await this.prisma.showtime.delete({ where: { id } });
  }
}
