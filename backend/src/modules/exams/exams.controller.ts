import { Request, Response, NextFunction } from 'express';
import { createExamSchema, updateExamSchema, saveMarksSchema } from './exams.schema.ts';
import {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getExamMarksList,
  saveExamMarks,
  getExamResultsDetails,
} from './exams.service.ts';
import { NotFoundError, UnauthorizedError } from '../../shared/errors/app-error.ts';
import { createAuditLog } from '../audit/audit.service.ts';

export async function listExams(_req: Request, res: Response, next: NextFunction) {
  try {
    const list = await getAllExams();
    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
}

export async function getExam(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const exam = await getExamById(id);
    if (!exam) {
      throw new NotFoundError(`Exam with ID "${id}" not found`);
    }

    res.status(200).json({
      success: true,
      data: exam,
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

    const data = createExamSchema.parse(req.body);
    const exam = await createExam(data);

    await createAuditLog({
      userId: req.user.id,
      action: 'EXAM_CREATE',
      entity: 'exams',
      entityId: exam.id,
      afterData: exam,
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });

    res.status(201).json({
      success: true,
      data: exam,
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
    const data = updateExamSchema.parse(req.body);

    const oldExam = await getExamById(id);
    const updated = await updateExam(id, data);

    await createAuditLog({
      userId: req.user.id,
      action: 'EXAM_UPDATE',
      entity: 'exams',
      entityId: id,
      beforeData: oldExam,
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
    const oldExam = await getExamById(id);

    await deleteExam(id);

    await createAuditLog({
      userId: req.user.id,
      action: 'EXAM_DELETE',
      entity: 'exams',
      entityId: id,
      beforeData: oldExam,
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });

    res.status(200).json({
      success: true,
      message: `Exam "${id}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMarks(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const marks = await getExamMarksList(id);

    res.status(200).json({
      success: true,
      data: marks,
    });
  } catch (error) {
    next(error);
  }
}

export async function saveMarks(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const data = saveMarksSchema.parse(req.body);

    await saveExamMarks(id, data);

    await createAuditLog({
      userId: req.user.id,
      action: 'EXAM_MARKS_SAVE',
      entity: 'exams',
      entityId: id,
      afterData: { recordsCount: data.marks.length },
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });

    res.status(200).json({
      success: true,
      message: 'Exam marks saved successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getResults(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const results = await getExamResultsDetails(id);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
}
