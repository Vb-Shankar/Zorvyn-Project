const ApiError = require('../utils/ApiError');

const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication is required'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'You are not allowed to perform this action'));
  }

  return next();
};

module.exports = {
  authorize,
};
