const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const { USER_STATUS } = require('../utils/constants');

const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

const register = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'Email is already in use');
  }

  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: payload.password,
  });

  return {
    user,
    token: signToken(user),
  };
};

const login = async (payload) => {
  const user = await User.findOne({ email: payload.email.toLowerCase() }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(403, 'User account is inactive');
  }

  const isPasswordValid = await user.comparePassword(payload.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return {
    user,
    token: signToken(user),
  };
};

module.exports = {
  register,
  login,
};
