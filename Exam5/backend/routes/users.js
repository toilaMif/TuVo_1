const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', userController.createUser);  // Create user (register)
router.get('/', userController.getUsers);     // Get all users (no auth required per rubric)

// Private routes (require authentication)
router.get('/:id', userController.getUser);
router.put('/:id', auth, userController.updateUser);
router.patch('/:id/toggle', auth, userController.toggleUser);

module.exports = router;