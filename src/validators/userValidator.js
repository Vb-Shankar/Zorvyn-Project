const { z } = require('zod');
const { ROLES, USER_STATUS } = require('../utils/constants');

const userIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user id'),
});

const adminCreateUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.email(),
  password: z.string().min(6).max(128),
  role: z.enum([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]).default(ROLES.VIEWER),
  status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE]).default(USER_STATUS.ACTIVE),
});

const updateRoleSchema = z.object({
  role: z.enum([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]),
});

const updateStatusSchema = z.object({
  status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE]),
});

const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  role: z.enum([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]).optional(),
  status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE]).optional(),
  search: z.string().max(80).optional(),
});

module.exports = {
  userIdParamSchema,
  adminCreateUserSchema,
  updateRoleSchema,
  updateStatusSchema,
  listUsersQuerySchema,
};
