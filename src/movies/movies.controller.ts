import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { MovieEntity } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: MovieEntity })
  async create(@Body() createMovieDto: CreateMovieDto) {
    return new MovieEntity(await this.moviesService.create(createMovieDto));
  }

  @Get('all')
  @HttpCode(200)
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  async findAll() {
    const movies = await this.moviesService.findAll();
    return movies.map((movie) => new MovieEntity(movie));
  }

  @Put('update/:title')
  @HttpCode(200)
  async update(
    @Param('title') title: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    const decodedTitle = decodeURIComponent(title);
    await this.moviesService.update(decodedTitle, updateMovieDto);
  }

  @Delete(':title')
  @HttpCode(200)
  async remove(@Param('title') title: string) {
    await this.moviesService.remove(title);
  }
}
