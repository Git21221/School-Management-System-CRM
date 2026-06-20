import { Request, Response, NextFunction } from 'express';
import { issueCertificateSchema } from './certificates.schema.ts';
import { getAllCertificates, getCertificateByNo, createCertificate } from './certificates.service.ts';
import { NotFoundError, UnauthorizedError } from '../../shared/errors/app-error.ts';
import { createAuditLog } from '../audit/audit.service.ts';

export async function listCertificates(_req: Request, res: Response, next: NextFunction) {
  try {
    const list = await getAllCertificates();
    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCertificate(req: Request, res: Response, next: NextFunction) {
  try {
    const { certNo } = req.params;
    const cert = await getCertificateByNo(certNo);
    if (!cert) {
      throw new NotFoundError(`Certificate "${certNo}" not found`);
    }

    res.status(200).json({
      success: true,
      data: cert,
    });
  } catch (error) {
    next(error);
  }
}

export async function issue(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const data = issueCertificateSchema.parse(req.body);
    const cert = await createCertificate(data);

    await createAuditLog({
      userId: req.user.id,
      action: 'CERTIFICATE_ISSUE',
      entity: 'certificates',
      entityId: cert?.certNo || null,
      afterData: cert,
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    });

    res.status(201).json({
      success: true,
      data: cert,
    });
  } catch (error) {
    next(error);
  }
}
