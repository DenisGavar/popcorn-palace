import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

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

    it('should create a showtime when no conflicts', async () => {
      prisma.showtime.findMany.mockResolvedValue([]);
      const createdShowtime = {
        id: 1,
        ...createShowtimeDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
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
  });
});
