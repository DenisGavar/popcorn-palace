import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import helmet from 'helmet';
import { Reflector, HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    // added from the main.ts file
    app.enableCors();
    app.use(helmet());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    await prisma.$connect();
    await app.init();
  });

  // clear the DB
  beforeEach(async () => {
    await prisma.$transaction([
      prisma.booking.deleteMany(),
      prisma.showtime.deleteMany(),
      prisma.movie.deleteMany(),
    ]);
  });

  // close all the connections
  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  const createMovieDto1: CreateMovieDto = {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    genre: 'Fantasy',
    duration: 178,
    rating: 8.9,
    releaseYear: 2001,
  };

  const createMovieDto2: CreateMovieDto = {
    title: 'The Lord of the Rings: The Two Towers',
    genre: 'Fantasy',
    duration: 179,
    rating: 8.8,
    releaseYear: 2002,
  };

  const invalidCreateMovieDto = {
    //title: 'The Lord of the Rings: The Two Towers',
    //genre: 'Fantasy',
    duration: -10,
    rating: 15,
    releaseYear: 1500,
  };

  const invalidCreateMovieError = {
    message: [
      'title must be a string',
      'title should not be empty',
      'genre must be a string',
      'genre should not be empty',
      'duration must be a positive number',
      'rating must not be greater than 10',
      'releaseYear must not be less than 1800',
    ],
    error: 'Bad Request',
    statusCode: 400,
  };

  const movieAlreadyExistsError = {
    message:
      'A Movie with this title already exists. Please use a different title.',
    error: 'CONFLICT',
    statusCode: 409,
  };

  const movieNotFoundError = {
    message: 'Movie not found',
    error: 'NOT_FOUND',
    statusCode: 404,
  };

  const anotherMovieTitle = 'The Lord of the Rings: The Return of the King';

  const createShowtimeDto = {
    price: 20.2,
    theater: 'Sample Theater',
    startTime: '2025-02-14T11:47:46.125Z',
    endTime: '2025-02-14T14:47:46.125Z',
  };

  const updateShowtimeDto = {
    price: 22.2,
    theater: 'Another Theater',
    startTime: '2024-02-14T11:47:46.125Z',
    endTime: '2024-02-14T14:47:46.125Z',
  };

  const showtimeForeignKeyError = {
    message:
      'Foreign key constraint failed. A connected resource could not be found. Double-check your input and resubmit',
    error: 'BAD_REQUEST',
    statusCode: 400,
  };

  const showtimeOverlapsError = {
    message: 'Showtime overlaps with existing showtimes in the same theater',
    error: 'Conflict',
    statusCode: 409,
  };

  const anotherShowtimeId = 1;

  const showtimeNotFoundError = {
    message: `Showtime with id: ${anotherShowtimeId} does not exist.`,
    error: 'Not Found',
    statusCode: 404,
  };

  const showtimeNotFoundWithoutIdError = {
    error: 'NOT_FOUND',
    message: 'Showtime not found',
    statusCode: 404,
  };

  const createBookingDto = {
    seatNumber: 15,
    userId: '84438967-f68f-4fa0-b620-0f08217e76af',
  };

  const sameBookingError = {
    error: 'CONFLICT',
    message:
      'A Booking with this showtime_id, seat_number already exists. Please use a different showtime_id, seat_number.',
    statusCode: 409,
  };

  describe('movies', () => {
    describe('/movies (POST)', () => {
      it('successful creation', async () => {
        const response = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(createMovieDto1.title);
      });

      it('error validation', async () => {
        const response = await request(app.getHttpServer())
          .post('/movies')
          .send(invalidCreateMovieDto)
          .expect(400);

        expect(response.body).toEqual(invalidCreateMovieError);
      });

      it('error already exists', async () => {
        // the first creation
        await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);

        // the second creation
        const response = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(409);

        expect(response.body).toEqual(movieAlreadyExistsError);
      });
    });

    describe('/movies/all (GET)', () => {
      it('empty response', async () => {
        const response = await request(app.getHttpServer())
          .get('/movies/all')
          .expect(200);

        expect(response.body).toEqual([]);
      });

      it('two movies', async () => {
        // the first creation
        await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);

        // the second creation
        await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto2)
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/movies/all')
          .expect(200);

        expect(response.body.length).toEqual(2);
      });
    });

    describe('/movies/update/{title} (PUT)', () => {
      it('successful update', async () => {
        const responsePost = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);
        const id = responsePost.body.id;

        await request(app.getHttpServer())
          .put(`/movies/update/${createMovieDto1.title}`)
          .send(createMovieDto2)
          .expect(204);

        const responseGet = await request(app.getHttpServer())
          .get('/movies/all')
          .expect(200);

        expect(responseGet.body).toEqual([{ id, ...createMovieDto2 }]);
      });

      it('error not found', async () => {
        const response = await request(app.getHttpServer())
          .put(`/movies/update/${anotherMovieTitle}`)
          .send(createMovieDto1)
          .expect(404);

        expect(response.body).toEqual(movieNotFoundError);
      });
    });

    describe('/movies/{title} (DELETE)', () => {
      it('successful deletion', async () => {
        await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);

        await request(app.getHttpServer())
          .delete(`/movies/${createMovieDto1.title}`)
          .expect(204);

        const response = await request(app.getHttpServer())
          .get('/movies/all')
          .expect(200);

        expect(response.body.length).toEqual(0);
      });

      it('error not found', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/movies/${anotherMovieTitle}`)
          .expect(404);

        expect(response.body).toEqual(movieNotFoundError);
      });
    });
  });

  describe('showtimes', () => {
    describe('/showtimes (POST)', () => {
      it('successful creation', async () => {
        const responseMovie = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);
        const movieId = responseMovie.body.id;

        const response = await request(app.getHttpServer())
          .post('/showtimes')
          .send({ movieId: movieId, ...createShowtimeDto })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.theater).toBe(createShowtimeDto.theater);
      });

      it('foreign key constraint failed', async () => {
        const response = await request(app.getHttpServer())
          .post('/showtimes')
          .send({ movieId: 1, ...createShowtimeDto })
          .expect(400);

        expect(response.body).toEqual(showtimeForeignKeyError);
      });

      it('overlaps creation', async () => {
        const responseMovie = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);
        const movieId = responseMovie.body.id;

        await request(app.getHttpServer())
          .post('/showtimes')
          .send({ movieId: movieId, ...createShowtimeDto })
          .expect(201);

        const response = await request(app.getHttpServer())
          .post('/showtimes')
          .send({ movieId: movieId, ...createShowtimeDto })
          .expect(409);

        expect(response.body).toEqual(showtimeOverlapsError);
      });
    });

    describe('/showtimes/{id} (GET)', () => {
      it('successful get', async () => {
        const responseMovie = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);
        const movieId = responseMovie.body.id;

        const responseShowtime = await request(app.getHttpServer())
          .post('/showtimes')
          .send({ movieId: movieId, ...createShowtimeDto })
          .expect(201);
        const showtimeId = responseShowtime.body.id;

        const response = await request(app.getHttpServer())
          .get(`/showtimes/${showtimeId}`)
          .expect(200);

        expect(response.body).toEqual({
          id: showtimeId,
          movieId: movieId,
          ...createShowtimeDto,
        });
      });

      it('error not found', async () => {
        const response = await request(app.getHttpServer())
          .get(`/showtimes/${anotherShowtimeId}`)
          .expect(404);

        expect(response.body).toEqual(showtimeNotFoundError);
      });
    });

    describe('/showtimes/update/{id} (PUT)', () => {
      it('successful update', async () => {
        const responseMovie = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);
        const movieId = responseMovie.body.id;

        const responseShowtime = await request(app.getHttpServer())
          .post('/showtimes')
          .send({ movieId: movieId, ...createShowtimeDto })
          .expect(201);
        const showtimeId = responseShowtime.body.id;

        await request(app.getHttpServer())
          .put(`/showtimes/update/${showtimeId}`)
          .send(updateShowtimeDto)
          .expect(204);

        const responseGet = await request(app.getHttpServer())
          .get(`/showtimes/${showtimeId}`)
          .expect(200);

        expect(responseGet.body).toEqual({
          id: showtimeId,
          movieId: movieId,
          ...updateShowtimeDto,
        });
      });

      it('error not found', async () => {
        const response = await request(app.getHttpServer())
          .put(`/showtimes/update/${anotherShowtimeId}`)
          .send(updateShowtimeDto)
          .expect(404);

        expect(response.body).toEqual(showtimeNotFoundError);
      });
    });

    describe('/showtimes/{id} (DELETE)', () => {
      it('successful deletion', async () => {
        const responseMovie = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);
        const movieId = responseMovie.body.id;

        const responseShowtime = await request(app.getHttpServer())
          .post('/showtimes')
          .send({ movieId: movieId, ...createShowtimeDto })
          .expect(201);
        const showtimeId = responseShowtime.body.id;

        await request(app.getHttpServer())
          .delete(`/showtimes/${showtimeId}`)
          .expect(204);

        const response = await request(app.getHttpServer())
          .get(`/showtimes/${anotherShowtimeId}`)
          .expect(404);

        expect(response.body).toEqual(showtimeNotFoundError);
      });

      it('error not found', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/showtimes/${anotherShowtimeId}`)
          .expect(404);

        expect(response.body).toEqual(showtimeNotFoundWithoutIdError);
      });
    });
  });

  describe('bookings', () => {
    describe('/bookings (POST', () => {
      it('successful creation', async () => {
        const responseMovie = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);
        const movieId = responseMovie.body.id;

        const responseShowtime = await request(app.getHttpServer())
          .post('/showtimes')
          .send({ movieId: movieId, ...createShowtimeDto })
          .expect(201);
        const showtimeId = responseShowtime.body.id;

        const response = await request(app.getHttpServer())
          .post('/bookings')
          .send({ showtimeId: showtimeId, ...createBookingDto })
          .expect(201);

        expect(response.body).toHaveProperty('bookingId');
      });

      it('seat is booked', async () => {
        const responseMovie = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto1)
          .expect(201);
        const movieId = responseMovie.body.id;

        const responseShowtime = await request(app.getHttpServer())
          .post('/showtimes')
          .send({ movieId: movieId, ...createShowtimeDto })
          .expect(201);
        const showtimeId = responseShowtime.body.id;

        await request(app.getHttpServer())
          .post('/bookings')
          .send({ showtimeId: showtimeId, ...createBookingDto })
          .expect(201);

        // one more time the same showtime and the seat
        const response = await request(app.getHttpServer())
          .post('/bookings')
          .send({ showtimeId: showtimeId, ...createBookingDto })
          .expect(409);

        expect(response.body).toEqual(sameBookingError);
      });
    });
  });
});
