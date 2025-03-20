import { OmitType } from '@nestjs/swagger';
import { MovieEntity } from '../entities/movie.entity';

export class ResponseMovieDto extends OmitType(MovieEntity, [
  'createdAt',
  'updatedAt',
] as const) {}
