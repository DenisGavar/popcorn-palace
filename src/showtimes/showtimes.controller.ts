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
import { ShowtimeEntity } from './entities/showtime.entity';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: ShowtimeEntity })
  async create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return new ShowtimeEntity(
      await this.showtimesService.create(createShowtimeDto),
    );
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: ShowtimeEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const showtime = await this.showtimesService.findOne(id);
    // check if showtime exists
    if (!showtime) {
      throw new NotFoundException(`Showtime with id: ${id} does not exist.`);
    }
    return new ShowtimeEntity(showtime);
  }

  @Put('update/:id')
  @HttpCode(204)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    await this.showtimesService.update(id, updateShowtimeDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.showtimesService.remove(id);
  }
}
