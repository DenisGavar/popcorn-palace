import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowtimesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    prisma = module.get(PrismaService);

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

    it('should create a showtime when no conflicts', async () => {
      prisma.showtime.findMany.mockResolvedValue([]);
      prisma.showtime.create.mockResolvedValue(createdShowtime);

      const result = await service.create(createShowtimeDto);

      expect(prisma.showtime.findMany).toHaveBeenCalledWith({
        where: {
          theater: createShowtimeDto.theater,
          startTime: { lte: createShowtimeDto.endTime },
          endTime: { gte: createShowtimeDto.startTime },
        },
      });
      expect(prisma.showtime.create).toHaveBeenCalledWith({
        data: createShowtimeDto,
      });
      expect(result).toEqual(createdShowtime);
    });

    it('should throw ConflictException when overlapping exists', async () => {
      prisma.showtime.findMany.mockResolvedValue([
        {
          id: 2,
          ...createShowtimeDto,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      await expect(service.create(createShowtimeDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.showtime.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const showtimeId = 1;
    const showtime = {
      id: showtimeId,
      movieId: 12345,
      price: 20.2,
      theater: 'Sample Theater',
      startTime: new Date('2025-02-14T11:47:46.125405Z'),
      endTime: new Date('2025-02-14T14:47:46.125405Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return a showtime if found', async () => {
      prisma.showtime.findUnique.mockResolvedValue(showtime);

      const result = await service.findOne(showtimeId);

      expect(prisma.showtime.findUnique).toHaveBeenCalledWith({
        where: { id: showtimeId },
      });
      expect(result).toEqual(showtime);
    });
  });

  describe('update', () => {
    const showtimeId = 1;
    const existingShowtime = {
      id: showtimeId,
      movieId: 12345,
      price: 20.2,
      theater: 'Sample Theater',
      startTime: new Date('2025-02-14T11:47:46.125405Z'),
      endTime: new Date('2025-02-14T14:47:46.125405Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updateShowtimeDto: UpdateShowtimeDto = {
      movieId: 67890,
      price: 22.2,
      theater: 'Sample Theater',
      startTime: new Date('2025-02-14T11:47:46.125405Z'),
      endTime: new Date('2025-02-14T14:47:46.125405Z'),
    };

    const updateShowtimeDtoShort: UpdateShowtimeDto = {
      movieId: 67890,
      price: 22.2,
    };

    const overlappingShowtime = {
      id: 3,
      movieId: 12345,
      price: 18.2,
      theater: 'Sample Theater',
      startTime: new Date('2025-02-14T11:47:46.125405Z'),
      endTime: new Date('2025-02-14T14:47:46.125405Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update showtime if no overlapping exists', async () => {
      prisma.showtime.findUnique.mockResolvedValue(existingShowtime);
      prisma.showtime.findMany.mockResolvedValue([]);

      await service.update(showtimeId, updateShowtimeDto);

      expect(prisma.showtime.findUnique).toHaveBeenCalledWith({
        where: { id: showtimeId },
      });
      expect(prisma.showtime.findMany).toHaveBeenCalledWith({
        where: {
          theater: updateShowtimeDto.theater,
          startTime: { lte: updateShowtimeDto.endTime },
          endTime: { gte: updateShowtimeDto.startTime },
          id: { not: showtimeId },
        },
      });
      expect(prisma.showtime.update).toHaveBeenCalledWith({
        where: { id: showtimeId },
        data: updateShowtimeDto,
      });
    });

    it('should throw NotFoundException if showtime does not exist', async () => {
      prisma.showtime.findUnique.mockResolvedValue(null);

      await expect(
        service.update(showtimeId, updateShowtimeDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when overlapping exists', async () => {
      prisma.showtime.findUnique.mockResolvedValue(existingShowtime);
      prisma.showtime.findMany.mockResolvedValue([overlappingShowtime]);

      await expect(
        service.update(showtimeId, updateShowtimeDtoShort),
      ).rejects.toThrow(ConflictException);

      expect(prisma.showtime.findUnique).toHaveBeenCalledWith({
        where: { id: showtimeId },
      });
      expect(prisma.showtime.findMany).toHaveBeenCalledWith({
        where: {
          theater: existingShowtime.theater,
          startTime: { lte: existingShowtime.endTime },
          endTime: { gte: existingShowtime.startTime },
          id: { not: showtimeId },
        },
      });
      expect(prisma.showtime.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const showtimeId = 1;
    const deletedShowtime = {
      id: showtimeId,
      movieId: 12345,
      price: 20.2,
      theater: 'Sample Theater',
      startTime: new Date('2025-02-14T11:47:46.125405Z'),
      endTime: new Date('2025-02-14T14:47:46.125405Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should remove the showtime', async () => {
      prisma.showtime.delete.mockResolvedValue(deletedShowtime);

      await service.remove(showtimeId);

      expect(prisma.showtime.delete).toHaveBeenCalledWith({
        where: { id: showtimeId },
      });
    });
  });
});
