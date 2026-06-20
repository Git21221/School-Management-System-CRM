import { pool } from '../../config/database.ts';
import { logger } from '../../config/logger.ts';

export interface AuditLogParams {
  userId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  beforeData?: Record<string, unknown> | null;
  afterData?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function createAuditLog(params: AuditLogParams): Promise<void> {
  const {
    userId,
    action,
    entity,
    entityId,
    beforeData,
    afterData,
    ipAddress,
    userAgent,
  } = params;

  try {
    const query = `
      INSERT INTO audit_log (
        user_id, action, entity, entity_id, before_data, after_data, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const beforeJson = beforeData ? JSON.stringify(beforeData) : null;
    const afterJson = afterData ? JSON.stringify(afterData) : null;

    await pool.query(query, [
      userId || null,
      action,
      entity || null,
      entityId || null,
      beforeJson,
      afterJson,
      ipAddress || null,
      userAgent || null,
    ]);
  } catch (error) {
    logger.warn('Failed to write audit log', { action, entity, entityId, error });
  }
}
