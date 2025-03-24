import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  IsDate,
  IsNotEmpty,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// check that startTime is earlier than endTime
@ValidatorConstraint({ name: 'isStartTimeBeforeEndTime', async: false })
export class IsStartTimeBeforeEndTime implements ValidatorConstraintInterface {
  validate(value: Date, args: ValidationArguments): boolean {
    const endTime = args.object[args.constraints[0]];
    if (!(value instanceof Date) || !(endTime instanceof Date)) return false;
    return value.getTime() < endTime.getTime();
  }

  defaultMessage(args: ValidationArguments): string {
    return `Start time must be before ${args.constraints[0]}`;
  }
}

export class CreateShowtimeDto {
  @ApiProperty({
    example: 12345,
    description: 'The ID of the movie associated with this showtime',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  movieId: number;

  @ApiProperty({ example: 20.2, description: 'The price of the showtime' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 'Sample Theater',
    description: 'The theater where the movie is shown',
  })
  @IsNotEmpty()
  @IsString()
  theater: string;

  @ApiProperty({
    example: '2025-02-14T11:47:46.125Z',
    description: 'The start time of the showtime',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Validate(IsStartTimeBeforeEndTime, ['endTime'])
  startTime: Date;

  @ApiProperty({
    example: '2025-02-14T14:47:46.125Z',
    description: 'The end time of the showtime',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;
}
