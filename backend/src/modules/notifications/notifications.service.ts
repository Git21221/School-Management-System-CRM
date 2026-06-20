import { pool } from '../../config/database.ts';

export async function getUserNotifications(userId: string) {
  const [rows] = await pool.query(
    `SELECT id, type, title, message, is_read as isRead, created_at as createdAt 
     FROM notifications 
     WHERE user_id = ? OR user_id IS NULL 
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows as any[];
}

export async function markNotificationRead(id: number, userId: string) {
  await pool.query(
    'UPDATE notifications SET is_read = 1 WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
    [id, userId]
  );
}

export async function markAllNotificationsRead(userId: string) {
  await pool.query(
    'UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id IS NULL',
    [userId]
  );
}

export async function deleteNotification(id: number, userId: string) {
  await pool.query(
    'DELETE FROM notifications WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
    [id, userId]
  );
}
export async function createNotification(userId: string | null, type: string, title: string, message: string) {
  await pool.query(
    'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
    [userId, type, title, message]
  );
}
