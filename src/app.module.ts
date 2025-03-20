import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { ShowtimesModule } from './showtimes/showtimes.module';

@Module({
  imports: [PrismaModule, MoviesModule, ShowtimesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
