import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ResponseShowtimeDto } from './dto/response-showtime.dto';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: ResponseShowtimeDto })
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: ResponseShowtimeDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const showtime = await this.showtimesService.findOne(id);
    if (!showtime) {
      throw new NotFoundException(`Showtime with id: ${id} does not exist.`);
    }
    return showtime;
  }

  @Put('update/:id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    await this.showtimesService.update(id, updateShowtimeDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.showtimesService.remove(id);
  }
}
