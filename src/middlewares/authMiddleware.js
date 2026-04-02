const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { USER_STATUS } = require('../utils/constants');

const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Missing or invalid authorization token');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, jwtSecret);

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new ApiError(401, 'Invalid token subject');
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw new ApiError(403, 'User account is inactive');
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired token'));
    }
    return next(error);
  }
};

module.exports = {
  authenticate,
};
