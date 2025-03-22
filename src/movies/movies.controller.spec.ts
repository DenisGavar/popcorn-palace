import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieEntity } from './entities/movie.entity';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: DeepMockProxy<MoviesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    })
      .overrideProvider(MoviesService)
      .useValue(mockDeep<MoviesService>())
      .compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get(MoviesService);
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

    it('should create a movie and return a MovieEntity', async () => {
      moviesService.create.mockResolvedValue(createdMovie);

      const result = await controller.create(createMovieDto);

      expect(moviesService.create).toHaveBeenCalledWith(createMovieDto);
      expect(result).toBeInstanceOf(MovieEntity);
      expect(result).toMatchObject(createdMovie);
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

    it('should return an array of MovieEntity', async () => {
      moviesService.findAll.mockResolvedValue(movies);

      const result = await controller.findAll();

      expect(moviesService.findAll).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
      result.forEach((entity, index) => {
        expect(entity).toBeInstanceOf(MovieEntity);
        expect(entity).toMatchObject(movies[index]);
      });
    });
  });

  describe('update', () => {
    const encodedTitle =
      'The%20Lord%20of%20the%20Rings%3A%20The%20Fellowship%20of%20the%20Ring';
    const decodedTitle = decodeURIComponent(encodedTitle);
    const updateMovieDto: UpdateMovieDto = {
      title: 'The Lord of the Rings: The Two Towers',
      genre: 'Fantasy',
      duration: 179,
      rating: 8.8,
      releaseYear: 2002,
    };

    it('should update a movie', async () => {
      await controller.update(encodedTitle, updateMovieDto);

      expect(moviesService.update).toHaveBeenCalledWith(
        decodedTitle,
        updateMovieDto,
      );
    });
  });

  describe('remove', () => {
    const encodedTitle =
      'The%20Lord%20of%20the%20Rings%3A%20The%20Fellowship%20of%20the%20Ring';
    const decodedTitle = decodeURIComponent(encodedTitle);

    it('should remove a movie', async () => {
      await controller.remove(encodedTitle);

      expect(moviesService.remove).toHaveBeenCalledWith(decodedTitle);
    });
  });
});
