const express = require('express');
const router = express.Router();
const superAdminController = require('../controller/superAdminController');
const authMiddleware = require('../middlewares/authMiddleware');

// SuperAdmin Authentication Middleware
const superAdminAuth = (req, res, next) => {
  authMiddleware(req, res, (err) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
    
    // Check if user is super admin
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Super Admin privileges required.'
      });
    }
    
    next();
  });
};

// Public routes (no authentication required)
router.post('/login', superAdminController.superAdminLogin);

// Protected routes (authentication required)
router.get('/dashboard/stats', superAdminAuth, superAdminController.getDashboardStats);
router.get('/dashboard/recent-orders', superAdminAuth, superAdminController.getRecentOrders);
router.get('/dashboard/top-restaurants', superAdminAuth, superAdminController.getTopRestaurants);

// User Management
router.get('/users', superAdminAuth, superAdminController.getAllUsers);
router.get('/restaurant-owners', superAdminAuth, superAdminController.getAllRestaurantOwners);
router.put('/users/:userId/status', superAdminAuth, superAdminController.updateUserStatus);
router.delete('/users/:userId', superAdminAuth, superAdminController.deleteUser);
router.get('/orders/all', superAdminAuth, superAdminController.getAllOrders);


module.exports = router; 