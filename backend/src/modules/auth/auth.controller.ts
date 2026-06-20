import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env.ts';
import { loginSchema, changePasswordSchema } from './auth.schema.ts';
import {
  loginUser,
  refreshSession,
  logoutUser,
  changeUserPassword,
  getUserById,
} from './auth.service.ts';
import { UnauthorizedError } from '../../shared/errors/app-error.ts';

const COOKIE_NAME = 'refreshToken';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const ipAddress = req.ip || null;
    const userAgent = req.headers['user-agent'] || null;

    const result = await loginUser(data.email, data.password, ipAddress, userAgent);

    // Set refresh token in secure HttpOnly cookie
    res.cookie(COOKIE_NAME, result.refreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedError('Session cookie is missing');
    }

    const ipAddress = req.ip || null;
    const userAgent = req.headers['user-agent'] || null;

    const result = await refreshSession(token, ipAddress, userAgent);

    // Rotate refresh token cookie
    res.cookie(COOKIE_NAME, result.refreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (token) {
      await logoutUser(token);
    }

    // Clear session cookie
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const data = changePasswordSchema.parse(req.body);
    const ipAddress = req.ip || null;
    const userAgent = req.headers['user-agent'] || null;

    await changeUserPassword(req.user.id, data.currentPassword, data.newPassword, ipAddress, userAgent);

    // If password changed successfully, force logout by clearing cookie
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully. Please log in again.',
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await getUserById(req.user.id);
    if (!user) {
      throw new UnauthorizedError('User session invalid');
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}
