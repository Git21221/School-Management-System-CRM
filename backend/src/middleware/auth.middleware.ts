import { Request, Response, NextFunction } from 'express';
import { AppError, UnauthorizedError, ForbiddenError } from '../shared/errors/app-error.js';
import { verifyAccessToken } from '../shared/utils/crypto.js';
import { isJwtVerificationError } from '../shared/utils/jwt-errors.js';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Authentication token is missing');
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    if (isJwtVerificationError(error)) {
      return next(new UnauthorizedError('Invalid or expired authentication token'));
    }
    return next(error);
  }
}

export function requireRoles(...roles: ('admin' | 'staff' | 'faculty')[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Access denied: insufficient permissions'));
    }

    return next();
  };
}
