const AppError = require('../utils/appError');

// Helper to handle CastError (Invalid ObjectIds)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Helper to handle Duplicate Key errors
const handleDuplicateFieldsDB = (err) => {
  // Extract key/value that caused duplicate error
  const keyValue = err.keyValue ? JSON.stringify(err.keyValue) : '';
  const message = `Duplicate field value: ${keyValue}. Please use another value!`;
  return new AppError(message, 400);
};

// Helper to handle ValidationError from Mongoose
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle 404 Not Found
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

// Centralized Global Error Handler
const errorHandler = (err, req, res, next) => {
  // Setup defaults
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  error.code = err.code;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  // Log error console message
  console.error('API Error details:', err);

  // Mongoose / Database error translation
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

  res.status(error.statusCode).json({
    success: false,
    status: error.status,
    message: error.message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
