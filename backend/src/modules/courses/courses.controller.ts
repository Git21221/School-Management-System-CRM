import { Request, Response, NextFunction } from 'express';
import { createCourseSchema, updateCourseSchema } from './courses.schema.ts';
import {
  getAllCourses,
  getCourseById,
  getCourseStats,
  createCourse,
  updateCourse,
  deleteCourse,
} from './courses.service.ts';
import { NotFoundError, UnauthorizedError } from '../../shared/errors/app-error.ts';
import { createAuditLog } from '../audit/audit.service.ts';

export async function listCourses(_req: Request, res: Response, next: NextFunction) {
  try {
    const courses = await getAllCourses();
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const course = await getCourseById(id);
    if (!course) {
      throw new NotFoundError(`Course with ID "${id}" not found`);
    }

    const stats = await getCourseStats(id);

    res.status(200).json({
      success: true,
      data: {
        ...course,
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const data = createCourseSchema.parse(req.body);
    const course = await createCourse(data);

    await createAuditLog({
      userId: req.user.id,
      action: 'COURSE_CREATE',
      entity: 'courses',
      entityId: course.id,
      afterData: course,
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const data = updateCourseSchema.parse(req.body);

    const oldCourse = await getCourseById(id);
    const updated = await updateCourse(id, data);

    await createAuditLog({
      userId: req.user.id,
      action: 'COURSE_UPDATE',
      entity: 'courses',
      entityId: id,
      beforeData: oldCourse,
      afterData: updated,
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const oldCourse = await getCourseById(id);
    
    await deleteCourse(id);

    await createAuditLog({
      userId: req.user.id,
      action: 'COURSE_DELETE',
      entity: 'courses',
      entityId: id,
      beforeData: oldCourse,
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });

    res.status(200).json({
      success: true,
      message: `Course "${id}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
}
