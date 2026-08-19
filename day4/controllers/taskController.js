const Task = require('../models/taskModel');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

// 1. Get all tasks (populated with assignedTo and collaborators)
const getAllTasks = asyncHandler(async (req, res, next) => {
  const tasks = await Task.find()
    .populate('assignedTo', 'name email role')
    .populate('collaborators', 'name email role');

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// 2. Get task by ID (populated with assignedTo and collaborators)
const getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email role')
    .populate('collaborators', 'name email role');

  if (!task) {
    return next(new AppError('Task not found', 404));
  }
  res.status(200).json({
    success: true,
    data: task,
  });
});

// 3. Create a new task (checking User linkages)
const createTask = asyncHandler(async (req, res, next) => {
  const { title, description, status, priority, dueDate, assignedTo, collaborators } = req.body;

  // Verify assignedTo user exists if provided
  if (assignedTo) {
    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return next(new AppError(`Assigned user (ID: ${assignedTo}) does not exist`, 404));
    }
  }

  // Verify all collaborators exist if provided
  if (collaborators && collaborators.length > 0) {
    const existingCollaboratorsCount = await User.countDocuments({
      _id: { $in: collaborators },
    });
    if (existingCollaboratorsCount !== collaborators.length) {
      return next(new AppError('One or more collaborator users do not exist', 404));
    }
  }

  const newTask = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    collaborators,
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: newTask,
  });
});

// 4. Update task by ID (checking User linkages if updated)
const updateTask = asyncHandler(async (req, res, next) => {
  const { assignedTo, collaborators } = req.body;

  // Verify assignedTo user exists if provided in update
  if (assignedTo) {
    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return next(new AppError(`Assigned user (ID: ${assignedTo}) does not exist`, 404));
    }
  }

  // Verify collaborators exist if provided in update
  if (collaborators && collaborators.length > 0) {
    const existingCollaboratorsCount = await User.countDocuments({
      _id: { $in: collaborators },
    });
    if (existingCollaboratorsCount !== collaborators.length) {
      return next(new AppError('One or more collaborator users do not exist', 404));
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('assignedTo', 'name email role')
    .populate('collaborators', 'name email role');

  if (!updatedTask) {
    return next(new AppError('Task not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: updatedTask,
  });
});

// 5. Delete task by ID
const deleteTask = asyncHandler(async (req, res, next) => {
  const deletedTask = await Task.findByIdAndDelete(req.params.id);
  if (!deletedTask) {
    return next(new AppError('Task not found', 404));
  }
  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
});

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
