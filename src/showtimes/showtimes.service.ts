import { Injectable } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShowtimesService {
  constructor(private prisma: PrismaService) {}

  create(createShowtimeDto: CreateShowtimeDto) {
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
