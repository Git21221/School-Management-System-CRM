import jwt from 'jsonwebtoken';

export function isJwtVerificationError(error: unknown): boolean {
  return (
    error instanceof jwt.JsonWebTokenError ||
    error instanceof jwt.TokenExpiredError ||
    error instanceof jwt.NotBeforeError
  );
}
