const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const {
  validateCreateUser,
  validateUpdateUser,
} = require('../middlewares/validationMiddleware');

// User Routes with validation middlewares
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', validateCreateUser, createUser);
router.put('/:id', validateUpdateUser, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
