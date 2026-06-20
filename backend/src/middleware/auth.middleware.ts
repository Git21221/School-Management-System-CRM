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

type AppRole = 'admin' | 'staff' | 'faculty' | 'super_admin';

function roleMatches(userRole: AppRole, allowed: AppRole): boolean {
  if (userRole === allowed) return true;
  if (allowed === 'admin' && userRole === 'super_admin') return true;
  return false;
}

export function requireRoles(...roles: AppRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const userRole = req.user.role as AppRole;
    if (!roles.some((role) => roleMatches(userRole, role))) {
      return next(new ForbiddenError('Access denied: insufficient permissions'));
    }

    return next();
  };
}
