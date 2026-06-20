import { pool } from '../../config/database.ts';
import { CreateFacultyInput, UpdateFacultyInput } from './faculty.schema.ts';
import { ConflictError, NotFoundError } from '../../shared/errors/app-error.ts';

export async function getAllFaculty() {
  const [rows] = await pool.query('SELECT * FROM faculty ORDER BY created_at DESC');
  return rows as any[];
}

export async function getFacultyById(id: string) {
  const [rows] = await pool.query('SELECT * FROM faculty WHERE id = ?', [id]);
  const list = rows as any[];
  return list[0] || null;
}

export async function createFaculty(data: CreateFacultyInput) {
  const existing = await getFacultyById(data.id);
  if (existing) {
    throw new ConflictError(`Faculty with ID "${data.id}" already exists`);
  }

  await pool.query(
    `INSERT INTO faculty (id, name, subject, phone, email, salary, experience, qualification, photo_url) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id,
      data.name,
      data.subject,
      data.phone || null,
      data.email || null,
      data.salary,
      data.experience || null,
      data.qualification || null,
      data.photoUrl || null,
    ]
  );

  return data;
}

export async function updateFaculty(id: string, data: UpdateFacultyInput) {
  const existing = await getFacultyById(id);
  if (!existing) {
    throw new NotFoundError(`Faculty with ID "${id}" not found`);
  }

  const columnMap: Record<string, string> = {
    name: 'name',
    subject: 'subject',
    phone: 'phone',
    email: 'email',
    salary: 'salary',
    experience: 'experience',
    qualification: 'qualification',
    photoUrl: 'photo_url',
  };

  const fields: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && columnMap[key]) {
      fields.push(`${columnMap[key]} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    return existing;
  }

  values.push(id);
  const query = `UPDATE faculty SET ${fields.join(', ')} WHERE id = ?`;
  await pool.query(query, values);

  return getFacultyById(id);
}

export async function deleteFaculty(id: string) {
  const existing = await getFacultyById(id);
  if (!existing) {
    throw new NotFoundError(`Faculty with ID "${id}" not found`);
  }

  // Check if faculty is linked to any batches
  const [batches] = await pool.query(
    'SELECT COUNT(*) as count FROM batches WHERE faculty_id = ?',
    [id]
  ) as any[];

  if (batches[0]?.count > 0) {
    throw new ConflictError('Cannot delete faculty: they are assigned to active batches');
  }

  await pool.query('DELETE FROM faculty WHERE id = ?', [id]);
}
