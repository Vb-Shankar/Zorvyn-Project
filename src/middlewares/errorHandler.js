const { ZodError } = require('zod');
const ApiError = require('../utils/ApiError');

const notFound = (_req, _res, next) => {
  next(new ApiError(404, 'Route not found'));
};

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: err.issues,
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource id',
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate value found',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

module.exports = {
  notFound,
  errorHandler,
};
