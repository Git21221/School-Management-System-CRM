import { describe, it, expect, vi } from 'vitest';
import { z, ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import {
  AppError,
  UnauthorizedError,
  ValidationError,
} from '../shared/errors/app-error.js';
import { errorMiddleware } from '../middleware/error.middleware.js';

vi.mock('../config/logger.js', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

function createMockRes() {
  const res = {
    headersSent: false,
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as unknown as Response & { statusCode: number; body: unknown };
}

describe('errorMiddleware', () => {
  const next = vi.fn() as NextFunction;

  it('formats AppError with correct status and code', () => {
    const res = createMockRes();
    const err = new ValidationError('Email is required', [{ field: 'email', message: 'Required' }]);

    errorMiddleware(err, {} as Request, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email is required',
        details: [{ field: 'email', message: 'Required' }],
      },
    });
  });

  it('returns 400 for Zod validation errors', () => {
    const res = createMockRes();
    let zodErr: ZodError | undefined;
    try {
      z.object({ email: z.string().email() }).parse({});
    } catch (error) {
      if (error instanceof ZodError) {
        zodErr = error;
      }
    }

    errorMiddleware(zodErr!, {} as Request, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Validation failed' },
    });
    expect((res.body as { error: { details: unknown[] } }).error.details.length).toBeGreaterThan(0);
  });

  it('returns 401 for UnauthorizedError', () => {
    const res = createMockRes();

    errorMiddleware(new UnauthorizedError('Session cookie is missing'), {} as Request, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Session cookie is missing' },
    });
  });

  it('returns 500 for unexpected errors without exposing internals', () => {
    const res = createMockRes();
    const err = new Error('database connection lost');

    errorMiddleware(err, {} as Request, res, next);

    expect(res.statusCode).toBe(500);
    expect(res.body).toMatchObject({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    });
    expect((res.body as { error: { stack?: string } }).error.stack).toBeUndefined();
  });

  it('does not convert non-JWT operational errors to auth failures', () => {
    const res = createMockRes();
    const err = new AppError('Service unavailable', 503, 'SERVICE_UNAVAILABLE');

    errorMiddleware(err, {} as Request, res, next);

    expect(res.statusCode).toBe(503);
    expect(res.body).toMatchObject({
      error: { code: 'SERVICE_UNAVAILABLE', message: 'Service unavailable' },
    });
  });
});
