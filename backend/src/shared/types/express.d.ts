import { JWTPayload } from '../utils/crypto.js';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
