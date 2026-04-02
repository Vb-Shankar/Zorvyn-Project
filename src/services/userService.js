const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { getPagination } = require('../utils/pagination');

const listUsers = async (query) => {
  const { page, limit, skip } = getPagination(query.page, query.limit);

  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const createUserByAdmin = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'Email is already in use');
  }

  const user = await User.create({
    ...payload,
    email: payload.email.toLowerCase(),
  });

  return user;
};

const updateRole = async (id, role) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const updateStatus = async (id, status) => {
  const user = await User.findByIdAndUpdate(id, { status }, { new: true });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

module.exports = {
  listUsers,
  createUserByAdmin,
  updateRole,
  updateStatus,
};
