import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  create(createMovieDto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: createMovieDto,
      select: {
        id: true,
        title: true,
        genre: true,
        duration: true,
        rating: true,
        releaseYear: true,
      },
    });
  }

  findAll() {
    return this.prisma.movie.findMany({
      select: {
        id: true,
        title: true,
        genre: true,
        duration: true,
        rating: true,
        releaseYear: true,
      },
    });
  }

  async update(title: string, updateMovieDto: UpdateMovieDto) {
    await this.prisma.movie.update({
      where: { title },
      data: updateMovieDto,
    });
  }

  async remove(title: string) {
    await this.prisma.movie.delete({ where: { title } });
  }
}
