import { z } from 'zod';
import { v } from '../../shared/validation/fields.ts';

export const createFacultySchema = z.object({
  id: v.entityId('Faculty ID'),
  name: v.personName(),
  subject: v.subject(),
  phone: v.phoneOptional(),
  email: v.optionalEmail(),
  salary: v.positiveMoney().default(0),
  experience: v.experience(),
  qualification: v.qualification(),
  photoUrl: z.string().optional().nullable(),
});

export const updateFacultySchema = createFacultySchema.partial().omit({ id: true });

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
