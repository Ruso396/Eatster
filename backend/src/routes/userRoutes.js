
// module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/users', userController.getUsers);
// Get only users with role = 'user'
router.get('/users/only-users', userController.getOnlyUsers);
router.get('/users/weekly-stats', userController.getWeeklyUserStats);

module.exports = router;
