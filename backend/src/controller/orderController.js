const orderModel = require('../model/orderModel');
const restaurantModel = require('../model/restaurantModel'); // ✅ ADD this line
const db = require("../config/db");
// 1. Place Order
exports.placeOrder = (req, res) => {
  const { customer_id, restaurant_id, cartItems, address, paymentmethod, total_price } = req.body;

  if (!restaurant_id) {
    return res.status(400).json({ message: "Restaurant ID is required" });
  }

  const order_id = `ORD-${Date.now()}`;
  const order_date_time = new Date();
  const delivery_date_time = new Date(order_date_time.getTime() + 60 * 60 * 1000);
  const fullAddress = address?.trim() || 'No address provided';

  const orderData = {
    order_id,
    customer_id,
    restaurant_id,
    total_price,
    delivery_address_: fullAddress,
    paymentmethod,
    order_date_time,
    delivery_date_time,
    order_status: 'Placed',
  };

  orderModel.createOrder(orderData, cartItems, (err) => {
    if (err) {
      console.error("Order insert failed", err);
      return res.status(500).json({ message: "Failed to place order" });
    }
    res.status(200).json({ message: "Order placed successfully" });
  });
};

// 2. Get Order History (Customer)
exports.getOrderHistory = (req, res) => {
  const { customerId } = req.params;

  orderModel.getOrderHistory(customerId, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching history" });
    res.status(200).json(results);
  });
};

// 3. Clear Cart
exports.clearCustomerCart = (req, res) => {
  const { customerId } = req.params;

  orderModel.clearCart(customerId, (err, result) => {
    if (err) {
      console.error("Error clearing cart:", err);
      return res.status(500).json({ message: "Error clearing cart" });
    }
    return res.status(200).json({ message: "Cart cleared successfully" });
  });
};

// 4. Track Order
exports.trackOrderById = (req, res) => {
  const { orderId } = req.params;

  orderModel.trackOrderById(orderId, (err, fullOrder) => {
    if (err) {
      console.error("Tracking order failed", err);
      return res.status(500).json({ message: "Failed to track order" });
    }

    res.status(200).json(fullOrder);
  });
};

exports.getOrdersByRestaurantId = (req, res) => {
  const restaurantId = req.user?.restaurant_id;

  if (!restaurantId) {
    return res.status(400).json({ message: "Restaurant ID not found in token." });
  }

  orderModel.getOrdersByRestaurantId(restaurantId, (err, results) => {
    if (err) {
      console.error("Error fetching orders by restaurant:", err);
      return res.status(500).json({ message: "Error fetching orders" });
    }
    res.status(200).json(results); // 🔄 already formatted array
  });
};


// 6. Update Order Status
exports.updateOrderStatus = (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  orderModel.updateOrderStatus(orderId, status, (err, result) => {
    if (err) {
      console.error("Update order status failed", err);
      return res.status(500).json({ message: "Error updating order status" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found or no changes made." });
    }
    res.status(200).json({ message: "Order status updated successfully" });
  });
};

// 7. Cancel Order
exports.cancelOrder = (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  if (!reason) return res.status(400).json({ message: "Cancel reason is required" });

  orderModel.cancelOrder(orderId, reason, (err, result) => {
    if (err) {
      console.error("Cancel order failed", err);
      return res.status(500).json({ message: "Error cancelling order" });
    }
    res.status(200).json({ message: "Order cancelled successfully" });
  });
};

// 8. Get All Orders (Superadmin)
// exports.getAllOrders = (req, res) => {
//   orderModel.getOrders((err, results) => {
//     if (err) {
//       console.error("Error fetching all orders:", err);
//       return res.status(500).json({ message: "Error fetching all orders" });
//     }
//     res.status(200).json(results);
//   });
// };

exports.getAllOrders = (req, res) => {
  orderModel.getOrders((err, results) => {
    if (err) {
      console.error("Error fetching all orders:", err);
      return res.status(500).json({ message: "Error fetching all orders" });
    }
    res.status(200).json(results);
  });
};


// ✅ 9. Get All Restaurants (NEW)
exports.getAllRestaurants = (req, res) => {
  restaurantModel.getAllRestaurants((err, results) => {
    if (err) {
      console.error("Error fetching restaurants:", err);
      return res.status(500).json({ message: "Failed to fetch restaurants" });
    }
    res.status(200).json(results);
  });
};

// ✅ 10. Get Restaurant by ID (NEW)
exports.getRestaurantById = (req, res) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    return res.status(400).json({ message: "Restaurant ID is required" });
  }

  restaurantModel.getRestaurantById(restaurantId, (err, result) => {
    if (err) {
      console.error("Error fetching restaurant:", err);
      return res.status(500).json({ message: "Failed to fetch restaurant" });
    }

    if (!result) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(result);
  });
};
// exports.getTodayStats = (req, res) => {
//   const { restaurantId } = req.params;

//   const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

//   const queryStats = `
//     SELECT 
//       COUNT(*) AS totalOrders,
//       COALESCE(SUM(total_price), 0) AS totalSales
//     FROM orders
//     WHERE restaurant_id = ? AND DATE(order_date_time) = ?
//   `;

//   const queryLive = `
//     SELECT COUNT(*) AS liveOrders
//     FROM orders
//     WHERE restaurant_id = ? AND DATE(order_date_time) = ? 
//     AND order_status NOT IN ('Cancelled', 'Delivered')
//   `;

//   const queryRecent = `
//     SELECT order_id, total_price, order_status, order_date_time 
//     FROM orders
//     WHERE restaurant_id = ? AND DATE(order_date_time) = ?
//     ORDER BY order_date_time DESC
//     LIMIT 5
//   `;

//   db.query(queryStats, [restaurantId, today], (err, statsResult) => {
//     if (err) return res.status(500).json({ message: "Stats query failed" });

//     db.query(queryLive, [restaurantId, today], (err2, liveResult) => {
//       if (err2) return res.status(500).json({ message: "Live orders query failed" });

//       db.query(queryRecent, [restaurantId, today], (err3, recentResult) => {
//         if (err3) return res.status(500).json({ message: "Recent orders query failed" });

//         res.status(200).json({
//           totalOrders: statsResult[0].totalOrders,
//           totalSales: statsResult[0].totalSales,
//           liveOrders: liveResult[0].liveOrders,
//           recentOrders: recentResult
//         });
//       });
//     });
//   });
// };


// controller/orderController.js
exports.getTodayStats = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // ✅ Only count NON-CANCELLED for summary cards
    const [stats] = await db.promise().query(
      `SELECT COUNT(*) AS totalOrders, COALESCE(SUM(total_price), 0) AS totalSales
       FROM orders
       WHERE restaurant_id = ? AND DATE(order_date_time) = CURDATE()
         AND order_status != 'Cancelled'`,
      [restaurantId]
    );

    const [live] = await db.promise().query(
      `SELECT COUNT(*) AS liveOrders 
       FROM orders
       WHERE restaurant_id = ? AND DATE(order_date_time) = CURDATE()
         AND order_status IN ('pending','preparing','out_for_delivery')`,
      [restaurantId]
    );

    // ✅ Get *all* recent orders (even cancelled) for the table
    const [recentOrders] = await db.promise().query(
      `SELECT order_id, order_status, total_price, order_date_time
       FROM orders
       WHERE restaurant_id = ? AND DATE(order_date_time) = CURDATE()
       ORDER BY order_date_time DESC
       LIMIT 5`,
      [restaurantId]
    );

    res.json({
      totalOrders: stats[0].totalOrders,
      totalSales: stats[0].totalSales,
      liveOrders: live[0].liveOrders,
      recentOrders
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Superadmin - Get Orders by any restaurant ID
exports.getOrdersByRestaurant = (req, res) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    return res.status(400).json({ message: "Restaurant ID is required" });
  }

  orderModel.getOrdersByRestaurantId(restaurantId, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }

    res.status(200).json(results);
  });
};

exports.getSuperOrdersByRestaurantId = (req, res) => {
  const { restaurantId } = req.params;
  orderModel.getSuperOrdersByRestaurantId(restaurantId, (err, results) => {
    if (err) {
      console.error("Error fetching orders by restaurant:", err);
      return res.status(500).json({ message: "Error fetching orders" });
    }
    res.status(200).json(results);
  });
};


// ✅ ADD REVIEW
// ✅ ADD REVIEW — insert query correct
exports.addReview = (req, res) => {
  const { order_id, restaurant_id, customer_id, rating, comment } = req.body;

  if (!order_id || !restaurant_id || !customer_id || !rating) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const query = "INSERT INTO reviews (order_id, restaurant_id, customer_id, rating, comment) VALUES (?, ?, ?, ?, ?)";

  db.query(query, [order_id, restaurant_id, customer_id, rating, comment], (err) => {
    if (err) {
      console.error("❌ DB Insert Error:", err);
      return res.status(500).json({ message: "Failed to add review" });
    }
    res.status(200).json({ message: "Review added successfully" });
  });
};

// ✅ GET REVIEWS — SELECT query correct
exports.getReviewsByRestaurantId = (req, res) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    return res.status(400).json({ message: "Missing restaurant ID" });
  }

  const query = "SELECT * FROM reviews WHERE restaurant_id = ? ORDER BY created_at DESC";

  db.query(query, [restaurantId], (err, results) => {
    if (err) {
      console.error("❌ DB Select Error:", err);
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
    res.status(200).json(results);
  });
};
