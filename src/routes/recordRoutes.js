const express = require('express');
const recordController = require('../controllers/recordController');
const validate = require('../middlewares/validate');
const {
  recordIdParamSchema,
  createRecordSchema,
  updateRecordSchema,
  listRecordQuerySchema,
} = require('../validators/recordValidator');
const { authorize } = require('../middlewares/rbacMiddleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.get('/', validate(listRecordQuerySchema, 'query'), recordController.listRecords);
router.get('/:id', validate(recordIdParamSchema, 'params'), recordController.getRecordById);

router.post('/', authorize(ROLES.ADMIN), validate(createRecordSchema), recordController.createRecord);
router.patch('/:id', authorize(ROLES.ADMIN), validate(recordIdParamSchema, 'params'), validate(updateRecordSchema), recordController.updateRecord);
router.delete('/:id', authorize(ROLES.ADMIN), validate(recordIdParamSchema, 'params'), recordController.deleteRecord);

module.exports = router;
