import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createBookingDto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 15,
      userId: '84438967-f68f-4fa0-b620-0f08217e76af',
    };

    const createdBooking = {
      id: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae',
      ...createBookingDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a booking', async () => {
      prisma.booking.create.mockResolvedValue(createdBooking);

      const result = await service.create(createBookingDto);

      expect(prisma.booking.create).toHaveBeenCalledWith({
        data: createBookingDto,
      });
      expect(result).toEqual(createdBooking);
    });
  });
});
