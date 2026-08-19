const express = require('express');

// Import Routers
const healthRouter = require('./routers/healthRouter');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

// Import Middlewares
const requestLogger = require('./middlewares/loggerMiddleware');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Built-in Middleware for JSON parsing
app.use(express.json());

// Custom Logger Middleware
app.use(requestLogger);

// Mount API Routes
app.use('/api/health', healthRouter);
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

// Root route for welcome/info
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Node.js + Express + MongoDB Task & User API',
    endpoints: {
      health: 'GET /api/health',
      users: 'GET, POST /api/users | GET, PUT, DELETE /api/users/:id',
      tasks: 'GET, POST /api/tasks | GET, PUT, DELETE /api/tasks/:id',
    },
  });
});

// Handle 404 Not Found
app.use(notFoundHandler);

// Handle Global Errors
app.use(errorHandler);

module.exports = app;
