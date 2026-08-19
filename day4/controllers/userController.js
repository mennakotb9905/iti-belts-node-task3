const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

// 1. Get all users
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// 2. Get user by ID
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// 3. Create a new user
const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const newUser = await User.create({ name, email, password, role });
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser,
  });
});

// 4. Update user by ID
const updateUser = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser,
  });
});

// 5. Delete user by ID
const deleteUser = asyncHandler(async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    return next(new AppError('User not found', 404));
  }
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
