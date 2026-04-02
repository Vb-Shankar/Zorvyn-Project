const { z } = require('zod');

const dashboardQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

module.exports = {
  dashboardQuerySchema,
};
