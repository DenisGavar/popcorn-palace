-- CreateTable
CREATE TABLE "movies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "release_year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "showtimes" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "theater" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "showtimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "showtime_id" INTEGER NOT NULL,
    "seat_number" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_title_key" ON "movies"("title");

-- CreateIndex
CREATE INDEX "showtimes_theater_start_time_end_time_idx" ON "showtimes"("theater", "start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_showtime_id_seat_number_key" ON "bookings"("showtime_id", "seat_number");

-- AddForeignKey
ALTER TABLE "showtimes" ADD CONSTRAINT "showtimes_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "showtimes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
