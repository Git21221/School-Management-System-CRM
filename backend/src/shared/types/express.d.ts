import { JWTPayload } from '../utils/crypto.ts';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
