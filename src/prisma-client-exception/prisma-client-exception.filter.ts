import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  private errorMappings = [
    { code: 'P2002', status: HttpStatus.CONFLICT },
    { code: 'P2003', status: HttpStatus.BAD_REQUEST },
    { code: 'P2025', status: HttpStatus.NOT_FOUND },
  ];

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // get HttpStatus
    const mapping = this.errorMappings.find((m) => m.code === exception.code);

    if (!mapping) {
      super.catch(exception, host);
      return;
    }

    response.status(mapping.status).json({
      message: this.getMessage(exception),
      error: HttpStatus[mapping.status],
      statusCode: mapping.status,
    });
  }

  // generate an error message
  getMessage(exception: Prisma.PrismaClientKnownRequestError): string {
    switch (exception.code) {
      // "Unique constraint failed on the {constraint}"
      case 'P2002':
        const fields = (exception.meta?.target as string[])?.join(', ');
        const modelName = exception.meta?.modelName || 'item';

        if (fields && modelName) {
          return `A ${modelName} with this ${fields} already exists. Please use a different ${fields}.`;
        }
        return 'This data conflicts with an existing entry. Please provide unique values.';

      // "Foreign key constraint failed on the field: {field_name}"
      case 'P2003':
        return 'Foreign key constraint failed. A connected resource could not be found. Double-check your input and resubmit';

      // "An operation failed because it depends on one or more records that were required but not found. {cause}"
      case 'P2025':
        const model = exception.meta?.modelName as string;
        return `${model || 'Record'} not found`;

      default:
        return 'An error occurred while processing your request';
    }
  }
}
