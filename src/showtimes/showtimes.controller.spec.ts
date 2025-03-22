import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { ShowtimeEntity } from './entities/showtime.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let showtimesService: DeepMockProxy<ShowtimesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [ShowtimesService],
    })
      .overrideProvider(ShowtimesService)
      .useValue(mockDeep<ShowtimesService>())
      .compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    showtimesService = module.get(ShowtimesService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createShowtimeDto: CreateShowtimeDto = {
      movieId: 1,
      price: 20.2,
      theater: 'Sample Theater',
      startTime: new Date('2025-02-14T11:47:46.125405Z'),
      endTime: new Date('2025-02-14T14:47:46.125405Z'),
    };

    const createdShowtime = {
      id: 1,
      ...createShowtimeDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a showtime and return a ShowtimeEntity', async () => {
      showtimesService.create.mockResolvedValue(createdShowtime);

      const result = await controller.create(createShowtimeDto);

      expect(showtimesService.create).toHaveBeenCalledWith(createShowtimeDto);
      expect(result).toBeInstanceOf(ShowtimeEntity);
      expect(result).toMatchObject(createdShowtime);
    });
  });

  describe('findOne', () => {
    const showtimeId = 1;
    const showtime = {
      id: showtimeId,
      movieId: 1,
      price: 20.2,
      theater: 'Sample Theater',
      startTime: new Date('2025-02-14T11:47:46.125405Z'),
      endTime: new Date('2025-02-14T14:47:46.125405Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return a ShowtimeEntity when showtime exists', async () => {
      showtimesService.findOne.mockResolvedValue(showtime);

      const result = await controller.findOne(showtimeId);

      expect(showtimesService.findOne).toHaveBeenCalledWith(showtimeId);
      expect(result).toBeInstanceOf(ShowtimeEntity);
      expect(result).toMatchObject(showtime);
    });

    it('should throw NotFoundException when showtime does not exist', async () => {
      showtimesService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(showtimeId)).rejects.toThrow(
        NotFoundException,
      );
      expect(showtimesService.findOne).toHaveBeenCalledWith(showtimeId);
    });
  });

  describe('update', () => {
    const showtimeId = 1;
    const updateShowtimeDto: UpdateShowtimeDto = {
      movieId: 2,
      price: 25.0,
      theater: 'Updated Theater',
      startTime: new Date('2025-02-14T11:47:46.125405Z'),
      endTime: new Date('2025-02-14T14:47:46.125405Z'),
    };

    it('should call update on showtimesService', async () => {
      await controller.update(showtimeId, updateShowtimeDto);

      expect(showtimesService.update).toHaveBeenCalledWith(
        showtimeId,
        updateShowtimeDto,
      );
    });
  });

  describe('remove', () => {
    const showtimeId = 1;

    it('should call remove on showtimesService', async () => {
      await controller.remove(showtimeId);

      expect(showtimesService.remove).toHaveBeenCalledWith(showtimeId);
    });
  });
});
