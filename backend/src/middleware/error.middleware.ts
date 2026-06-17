import { ZodError } from 'zod';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { AppError, type ErrorDetail } from '../shared/errors/app-error.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

interface ErrorResponseBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
    stack?: string;
  };
}

function isJsonSyntaxError(err: Error): boolean {
  return err.name === 'SyntaxError' && 'status' in err && (err as Error & { status?: number }).status === 400;
}

function zodToDetails(err: ZodError): ErrorDetail[] {
  return err.errors.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join('.') : undefined,
    message: issue.message,
  }));
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let details: ErrorDetail[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    details = err.details;
    if (statusCode >= 500) {
      logger.error(`[${errorCode}] ${message}`, { stack: err.stack });
    } else {
      logger.warn(`[${errorCode}] ${message}`);
    }
  } else if (err instanceof ZodError) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = zodToDetails(err);
    logger.warn(`[VALIDATION_ERROR] ${details.map(d => `${d.field}: ${d.message}`).join(' | ')}`);
  } else if (isJsonSyntaxError(err)) {
    statusCode = 400;
    errorCode = 'BAD_REQUEST';
    message = 'Invalid JSON payload';
    logger.warn(`[BAD_REQUEST] Invalid JSON payload`);
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `File too large (max ${env.MAX_UPLOAD_MB} MB)`
        : err.message;
    logger.warn(`[VALIDATION_ERROR] ${message}`);
  } else if (err.message.includes('Invalid file type')) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = err.message;
    logger.warn(`[VALIDATION_ERROR] ${message}`);
  } else {
    logger.error('Unexpected server error', { error: err.message, stack: err.stack });
  }

  const responseBody: ErrorResponseBody = {
    success: false,
    error: {
      code: errorCode,
      message,
    },
  };

  if (details.length > 0) {
    responseBody.error.details = details;
  }

  if (env.NODE_ENV === 'development' && !(err instanceof AppError) && !(err instanceof ZodError)) {
    responseBody.error.stack = err.stack;
  }

  return res.status(statusCode).json(responseBody);
}
