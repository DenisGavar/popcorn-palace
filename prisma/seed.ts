// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create the first movie
  await prisma.movie.upsert({
    where: { title: 'Sample Movie Title 1' },
    update: {},
    create: {
      id: 12345,
      title: 'Sample Movie Title 1',
      genre: 'Action',
      duration: 120,
      rating: 8.7,
      releaseYear: 2025,
    },
  });

  // create the second movie
  await prisma.movie.upsert({
    where: { title: 'Sample Movie Title 2' },
    update: {},
    create: {
      id: 67890,
      title: 'Sample Movie Title 2',
      genre: 'Comedy',
      duration: 90,
      rating: 7.5,
      releaseYear: 2024,
    },
  });

  // create a showtime for the first movie
  await prisma.showtime.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      movieId: 12345,
      theater: 'Sample Theater',
      startTime: new Date('2025-02-14T11:47:46.125Z'),
      endTime: new Date('2025-02-14T14:47:46.125Z'),
      price: 50.2,
    },
  });

  // create a booking for the showtime
  await prisma.booking.upsert({
    where: { id: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae' },
    update: {},
    create: {
      id: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae',
      showtimeId: 1,
      seatNumber: 15,
      userId: '84438967-f68f-4fa0-b620-0f08217e76af',
    },
  });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
