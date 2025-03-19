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
import { MovieEntity } from './entities/movie.entity';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: MovieEntity })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get('all')
  @HttpCode(200)
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  findAll() {
    return this.moviesService.findAll();
  }

  @Put('update/:title')
  @HttpCode(200)
  @ApiOkResponse({ type: MovieEntity })
  update(
    @Param('title') title: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    const decodedTitle = decodeURIComponent(title);
    return this.moviesService.update(decodedTitle, updateMovieDto);
  }

  @Delete(':title')
  @HttpCode(200)
  @ApiOkResponse({ type: MovieEntity })
  remove(@Param('title') title: string) {
    return this.moviesService.remove(title);
  }
}
