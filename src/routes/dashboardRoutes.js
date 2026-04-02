const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const validate = require('../middlewares/validate');
const { dashboardQuerySchema } = require('../validators/dashboardValidator');

const router = express.Router();

router.get('/stats', validate(dashboardQuerySchema, 'query'), dashboardController.getStats);

module.exports = router;
