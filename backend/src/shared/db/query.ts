import type { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../config/database.ts';

export async function queryRows<T extends RowDataPacket>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const [rows] = await pool.query<T[]>(sql, params);
  return rows;
}

export async function queryOne<T extends RowDataPacket>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> {
  const rows = await queryRows<T>(sql, params);
  return rows[0];
}
