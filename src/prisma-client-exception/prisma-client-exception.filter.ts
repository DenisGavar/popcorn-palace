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
    // TODO: add more errors if necessary
  ];

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

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

  getMessage(exception: Prisma.PrismaClientKnownRequestError): string {
    switch (exception.code) {
      case 'P2002':
        const fields = (exception.meta?.target as string[])?.join(', ');
        return `Unique constraint failed on: ${fields || 'unknown fields'}`;

      case 'P2003':
        return `Foreign key constraint failed`;

      case 'P2025':
        const model = exception.meta?.modelName as string;
        return `${model || 'Record'} not found`;

      default:
        return 'An error occurred while processing your request';
    }
  }
}
