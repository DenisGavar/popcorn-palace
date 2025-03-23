# Popcorn Palace Documentation

## Table of Contents

- [Project Overview](#project-overview)
- [Functionality](#functionality)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
  - [Prerequisites](#prerequisites)
  - [Cloning the Repository and Installing Dependencies](#cloning-the-repository-and-installing-dependencies)
  - [Environment Setup](#environment-setup)
  - [Starting the Database (PostgreSQL)](#starting-the-database-postgresql)
  - [Applying Migrations and Seeding the Database](#applying-migrations-and-seeding-the-database)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Movies API](#movies-api)
  - [Showtimes API](#showtimes-api)
  - [Bookings API](#bookings-api)
- [Testing](#testing)
- [License](#license)

---

## Project Overview

**The Popcorn Palace Movie Ticket Booking System** is a backend service designed to handle various operations related to movie, showtime, and booking management. This project is built using [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/), along with several other modern technologies.

---

## Functionality
The system provides the following APIs:

- **Movie API**: Manages movies available on the platform.
- **Showtime API**: Manages movies showtime on the theaters.
- **Booking API**: Manages the movie tickets booking.

---

## Technologies Used

- **NestJS** – A Node.js framework for building efficient and scalable server-side applications.
- **TypeScript** – Provides static type checking and modern JavaScript features.
- **Prisma** – An ORM for interacting with databases (using PostgreSQL).
- **PostgreSQL** – A relational database.
- **Swagger** – For API documentation and visualization.
- **ESLint & Prettier** – For maintaining consistent code style.
- **Jest** – For unit testing.
- **Docker Compose** – For easily running the PostgreSQL container.

---

## Installation and Setup

### Prerequisites

- **Node.js**
- **npm**
- **Docker**

### Cloning the Repository and Installing Dependencies

1. Clone the repository:
    ```bash
    git clone https://github.com/DenisGavar/popcorn-palace.git
    cd popcorn-palace
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

### Environment Setup
1. Copy the .env.example file to .env:
    ```bash
    cp .env.example .env
    ```
2. Adjust the database connection parameters in .env if needed:
    ```env
    POSTGRES_USER=popcorn-palace
    POSTGRES_PASSWORD=popcorn-palace
    POSTGRES_DB=popcorn-palace
    DATABASE_URL="postgresql://popcorn-palace:popcorn-palace@localhost:5432/popcorn-palace"
    ```

### Starting the Database (PostgreSQL)
The project includes a compose.yml file to launch the PostgreSQL container:

1. Start the PostgreSQL container:
    ```bash
    docker-compose up -d
    ```
    This will start PostgreSQL on port 5432 using the credentials specified in the .env file.

### Applying Migrations and Seeding the Database
To create the necessary tables in the database, you must apply the existing Prisma migrations. This step is mandatory.

1. Apply the migrations:
    ```bash
    npx prisma migrate dev
    ```
    This command creates the tables in the database as defined in your Prisma schema.

2. Optionally, populate the database with initial data (seeding):
    ```bash
    npx prisma db seed
    ```
    Use this command if you want to load sample data into the database.

### Running the Application
The application is available at: http://127.0.0.1:3000/

The application can be run in different modes:

* Development Mode (with hot-reloading):
    ```bash
    npm run start:dev
    ```

* Regular Start:
    ```bash
    npm run start
    ```

* Production Mode:
    ```bash
    npm run start:prod
    ```

To build the application:
```bash
npm run build
```

---

## API Documentation
Swagger documentation is available at: http://127.0.0.1:3000/api

### Movies API

| API Description           | Endpoint               | Request Body                          | Response Status | Response Body |
|---------------------------|------------------------|---------------------------------------|-----------------|---------------|
| Add a movie | POST /movies | { "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 } | 201 Created | { "id": 1, "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 }|
| Get all movies | GET /movies/all | | 200 OK | [ { "id": 12345, "title": "Sample Movie Title 1", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 }, { "id": 67890, "title": "Sample Movie Title 2", "genre": "Comedy", "duration": 90, "rating": 7.5, "releaseYear": 2024 } ] |
| Update a movie | PUT /movies/update/{movieTitle} | { "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 } | 204 No Content | |
| Delete a movie | DELETE /movies/{movieTitle} | | 204 No Content | |

### Showtimes API

| API Description           | Endpoint               | Request Body                          | Response Status | Response Body |
|---------------------------|------------------------|---------------------------------------|-----------------|---------------|
| Add a showtime | POST /showtimes | { "movieId": 1, "price":20.2, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } | 201 Created | { "id": 1, "price":50.2,"movieId": 1, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } |
| Get showtime by ID | GET /showtimes/{showtimeId} | | 200 OK | { "id": 1, "price":50.2, "movieId": 1, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } |
| Update a showtime | PUT /showtimes/update/{showtimeId}| { "movieId": 1, "price":50.2, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" } | 204 No Content | |
| Delete a showtime | DELETE /showtimes/{showtimeId} | | 204 No Content | |

### Bookings API

| API Description           | Endpoint               | Request Body                          | Response Status | Response Body |
|---------------------------|------------------------|---------------------------------------|-----------------|---------------|
| Book a ticket | POST /bookings | { "showtimeId": 1, "seatNumber": 15 , userId:"84438967-f68f-4fa0-b620-0f08217e76af"} | 200 OK | { "bookingId":"d1a6423b-4469-4b00-8c5f-e3cfc42eacae" } |

---

## Testing
The project uses Jest for testing.

* Run Unit Tests:
    ```bash
    npm run test
    ```
* Run End-to-End Tests:
    ```bash
    npm run test:e2e
    ```
* Run Tests with Coverage:
    ```bash
    npm run test:cov
    ```

---

## License

Nest is [MIT licensed](LICENSE).