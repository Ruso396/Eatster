
const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/place', orderController.placeOrder);
router.get('/history/:customerId', orderController.getOrderHistory);
router.delete("/clear/:customerId", orderController.clearCustomerCart);
router.get("/track/:orderId", orderController.trackOrderById);
router.put("/cancel/:orderId", orderController.cancelOrder);
// If inside orderRoutes.js:
router.get("/restaurants/all", protect, adminOnly, orderController.getAllRestaurants);
router.get("/restaurants/:restaurantId", orderController.getRestaurantById);

// ✅ Admin Routes
router.get("/restaurant", protect, adminOnly, orderController.getOrdersByRestaurantId);
router.put("/:orderId/status", protect, adminOnly, orderController.updateOrderStatus);
router.get('/dashboard/today/:restaurantId', protect, adminOnly, orderController.getTodayStats);
router.get("/all", protect, adminOnly, orderController.getAllOrders);
router.get("/restaurant/:restaurantId/orders", orderController.getOrdersByRestaurant);
router.get("/restaurant/:restaurantId", orderController.getSuperOrdersByRestaurantId);

// reviews
router.get('/reviews/:restaurantId', orderController.getReviewsByRestaurantId); // ✅ PUBLIC
router.get("/restaurant/:restaurantId", orderController.getSuperOrdersByRestaurantId);
router.post('/review', orderController.addReview);

module.exports = router;
