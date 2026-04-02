const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/userService');

const listUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.query);
  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: result,
  });
});

const createUser = asyncHandler(async (req, res) => {
  const result = await userService.createUserByAdmin(req.body);
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const updateRole = asyncHandler(async (req, res) => {
  const result = await userService.updateRole(req.params.id, req.body.role);
  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: result,
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const result = await userService.updateStatus(req.params.id, req.body.status);
  res.status(200).json({
    success: true,
    message: 'User status updated successfully',
    data: result,
  });
});

module.exports = {
  listUsers,
  createUser,
  updateRole,
  updateStatus,
};
