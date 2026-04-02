const { ZodError } = require('zod');
const ApiError = require('../utils/ApiError');

const validate = (schema, source = 'body') => (req, _res, next) => {
  try {
    req[source] = schema.parse(req[source]);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ApiError(400, 'Validation failed', error.issues));
    }
    return next(error);
  }
};

module.exports = validate;
