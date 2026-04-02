const express = require('express');
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const {
  userIdParamSchema,
  adminCreateUserSchema,
  updateRoleSchema,
  updateStatusSchema,
  listUsersQuerySchema,
} = require('../validators/userValidator');

const router = express.Router();

router.get('/', validate(listUsersQuerySchema, 'query'), userController.listUsers);
router.post('/', validate(adminCreateUserSchema), userController.createUser);
router.patch('/:id/role', validate(userIdParamSchema, 'params'), validate(updateRoleSchema), userController.updateRole);
router.patch('/:id/status', validate(userIdParamSchema, 'params'), validate(updateStatusSchema), userController.updateStatus);

module.exports = router;
