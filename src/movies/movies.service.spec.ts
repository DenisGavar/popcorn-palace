import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<MoviesService>(MoviesService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createMovieDto: CreateMovieDto = {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      genre: 'Fantasy',
      duration: 178,
      rating: 8.9,
      releaseYear: 2001,
    };

    const createdMovie = {
      id: 1,
      ...createMovieDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a movie', async () => {
      prisma.movie.create.mockResolvedValue(createdMovie);

      const result = await service.create(createMovieDto);

      expect(prisma.movie.create).toHaveBeenCalledWith({
        data: createMovieDto,
      });
      expect(result).toEqual(createdMovie);
    });
  });

  describe('findAll', () => {
    const movies = [
      {
        id: 12345,
        title: 'Sample Movie Title 1',
        genre: 'Action',
        duration: 120,
        rating: 8.7,
        releaseYear: 2025,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 67890,
        title: 'Sample Movie Title 2',
        genre: 'Comedy',
        duration: 90,
        rating: 7.5,
        releaseYear: 2024,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return an array of movies', async () => {
      prisma.movie.findMany.mockResolvedValue(movies);

      const result = await service.findAll();

      expect(prisma.movie.findMany).toHaveBeenCalled();
      expect(result).toEqual(movies);
    });
  });

  describe('update', () => {
    const title = 'The Lord of the Rings: The Fellowship of the Ring';
    const updateMovieDto: UpdateMovieDto = {
      title: 'The Lord of the Rings: The Two Towers',
      genre: 'Fantasy',
      duration: 179,
      rating: 8.8,
      releaseYear: 2002,
    };

    it('should update a movie', async () => {
      await service.update(title, updateMovieDto);

      expect(prisma.movie.update).toHaveBeenCalledWith({
        where: { title },
        data: updateMovieDto,
      });
    });
  });

  describe('remove', () => {
    const title = 'The Lord of the Rings: The Fellowship of the Ring';

    it('should remove a movie', async () => {
      await service.remove(title);

      expect(prisma.movie.delete).toHaveBeenCalledWith({
        where: { title },
      });
    });
  });
});
