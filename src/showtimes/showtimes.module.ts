import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  imports: [PrismaModule],
})
export class ShowtimesModule {}
