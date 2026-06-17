import type { RowDataPacket } from 'mysql2/promise';

export type UserRole = 'admin' | 'staff' | 'faculty';

export interface UserRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  phone: string | null;
  photo_url: string | null;
  created_at?: Date;
}

export interface UserProfileRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  photo_url?: string | null;
  created_at?: Date;
}

export interface UserPasswordRow extends RowDataPacket {
  password_hash: string;
}

export interface RefreshTokenRow extends RowDataPacket {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  revoked_at: Date | null;
}
