import { z } from 'zod';
import { v } from '../../shared/validation/fields.js';

export const updateInstituteSchema = z.object({
  name: v.personName().optional(),
  phone: v.phoneOptional(),
  email: v.optionalEmail(),
  address: v.addressOptional(),
  registrationNo: v.registrationNo(),
  academicYear: v.academicYear().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
});

export const updateReceiptConfigSchema = z.object({
  prefix: v.receiptPrefix().optional(),
  startingNumber: v.receiptNumber().optional(),
  footerText: z.string().max(500).optional(),
  showLogo: z.enum(['yes', 'no']).optional(),
  printFormat: z.enum(['A4', 'A5', 'Thermal']).optional(),
});

export const updateCertificateConfigSchema = z.object({
  prefix: v.receiptPrefix().optional(),
  authorisedBy: v.personName().optional(),
  bodyText: z.string().max(2000).optional(),
});

export type UpdateInstituteInput = z.infer<typeof updateInstituteSchema>;
export type UpdateReceiptConfigInput = z.infer<typeof updateReceiptConfigSchema>;
export type UpdateCertificateConfigInput = z.infer<typeof updateCertificateConfigSchema>;
