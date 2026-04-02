const { z } = require('zod');

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid record id');

const recordIdParamSchema = z.object({
  id: objectIdSchema,
});

const createRecordSchema = z.object({
  amount: z.coerce.number().positive(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1).max(80),
  date: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
});

const updateRecordSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1).max(80).optional(),
  date: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
});

const listRecordQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().max(80).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  createdBy: objectIdSchema.optional(),
});

module.exports = {
  recordIdParamSchema,
  createRecordSchema,
  updateRecordSchema,
  listRecordQuerySchema,
};
