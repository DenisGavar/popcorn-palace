import { OmitType } from '@nestjs/swagger';
import { ShowtimeEntity } from '../entities/showtime.entity';

export class ResponseShowtimeDto extends OmitType(ShowtimeEntity, [
  'createdAt',
  'updatedAt',
] as const) {}
