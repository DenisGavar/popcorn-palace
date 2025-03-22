import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingEntity } from './entities/booking.entity';

describe('BookingsController', () => {
  let controller: BookingsController;
  let bookingsService: DeepMockProxy<BookingsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [BookingsService],
    })
      .overrideProvider(BookingsService)
      .useValue(mockDeep<BookingsService>())
      .compile();

    controller = module.get<BookingsController>(BookingsController);
    bookingsService = module.get(BookingsService);
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

    it('should create a booking and return a BookingEntity', async () => {
      bookingsService.create.mockResolvedValue(createdBooking);

      const result = await controller.create(createBookingDto);

      expect(bookingsService.create).toHaveBeenCalledWith(createBookingDto);
      expect(result).toBeInstanceOf(BookingEntity);
      expect(result).toMatchObject(createdBooking);
    });
  });
});
