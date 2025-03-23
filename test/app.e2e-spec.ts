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

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.booking.deleteMany(),
      prisma.showtime.deleteMany(),
      prisma.movie.deleteMany(),
    ]);
  });

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

  const MovieNotFoundError = {
    message: 'Movie not found',
    error: 'NOT_FOUND',
    statusCode: 404,
  };

  const anotherTitle = 'The Lord of the Rings: The Return of the King';

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
          .put(`/movies/update/${anotherTitle}`)
          .send(createMovieDto1)
          .expect(404);

        expect(response.body).toEqual(MovieNotFoundError);
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
          .delete(`/movies/${anotherTitle}`)
          .expect(404);

        expect(response.body).toEqual(MovieNotFoundError);
      });
    });
  });
});
