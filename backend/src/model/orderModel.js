const db = require('../config/db');

// ✅ 1. Create Order + Invoice
const createOrder = (order, items, callback) => {
  const {
    order_id,
    customer_id,
    restaurant_id,
    total_price,
    delivery_address_,
    paymentmethod,
    order_date_time,
    delivery_date_time,
    order_status,
  } = order;

  const query = `INSERT INTO orders 
    (order_id, customer_id, restaurant_id, total_price, delivery_address_, paymentmethod, order_date_time, delivery_date_time, order_status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [order_id, customer_id, restaurant_id, total_price, delivery_address_, paymentmethod, order_date_time, delivery_date_time, order_status],
    (err, result) => {
      if (err) return callback(err);

      if (!items || !Array.isArray(items) || items.length === 0) {
        return callback(new Error("Cart items are empty or invalid"));
      }

      const orderItemsData = items.map((item) => [
        order_id,
        item.product_name || item.item_name || "Unknown",
        item.quantity || 1,
        parseFloat(item.price || 0),
        item.image_url || '',
      ]);

      const orderItemQuery = `INSERT INTO order_items (order_id, item_name, quantity, price, image_url) VALUES ?`;

      db.query(orderItemQuery, [orderItemsData], (itemErr) => {
        if (itemErr) return callback(itemErr);

        // ✅ Create invoice entry
        const gst = parseFloat((total_price * 0.05).toFixed(2));
        const total_with_gst = parseFloat((total_price + gst).toFixed(2));
        const invoice_id = `INV-${Date.now()}`;
        const created_at = new Date();

        const invoiceQuery = `
          INSERT INTO restaurant_invoices 
          (order_id, invoice_id, restaurant_id, customer_id, customer_name, customer_email, delivery_address, payment_method, total_price, gst, total_with_gst, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Optional: fetch customer name/email from database if needed
        db.query(
          invoiceQuery,
          [
            order_id,
            invoice_id,
            restaurant_id,
            customer_id,
            "Guest", // You can replace this with actual name
            "guest@example.com", // Or fetch from DB if needed
            delivery_address_,
            paymentmethod,
            total_price,
            gst,
            total_with_gst,
            "Generated", // or "COD" based on selected method
            created_at
          ],
          callback
        );
      });
    }
  );
};

// ✅ 2. Auto Update Order Status (Fixed to ignore cancelled/delivered)
const autoUpdateOrderStatus = (orderId, callback) => {
  const fetchQuery = "SELECT * FROM orders WHERE order_id = ?";
  db.query(fetchQuery, [orderId], (err, result) => {
    if (err || result.length === 0) return callback(err || new Error("Order not found"));

    const order = result[0];

    // ✅ Skip update if already cancelled or delivered
    if (order.order_status === "Cancelled" || order.order_status === "Delivered") {
      return callback(null, order); // Skip auto update
    }

    const placedTime = new Date(order.order_date_time).getTime();
    const currentTime = Date.now();
    const diff = currentTime - placedTime;

    let newStatus = order.order_status;
    if (diff >= 0 && diff < 30000) {
      newStatus = "Placed";
    } else if (diff >= 30000 && diff < 60000) {
      newStatus = "Preparing";
    } else if (diff >= 60000 && diff < 90000) {
      newStatus = "Out for delivery";
    } else if (diff >= 90000) {
      newStatus = "Delivered";
    }

    if (newStatus !== order.order_status) {
      const updateQuery = "UPDATE orders SET order_status = ? WHERE order_id = ?";
      db.query(updateQuery, [newStatus, orderId], (updateErr) => {
        if (updateErr) return callback(updateErr);
        callback(null, { ...order, order_status: newStatus });
      });
    } else {
      callback(null, order);
    }
  });
};

// ✅ 3. Track Order By ID (auto updates before returning)
const trackOrderById = (orderId, callback) => {
  autoUpdateOrderStatus(orderId, (err, updatedOrder) => {
    if (err) return callback(err);

    const itemsQuery = "SELECT * FROM order_items WHERE order_id = ?";
    db.query(itemsQuery, [orderId], (err2, itemResults) => {
      if (err2) return callback(err2);

      const orderWithItems = {
        ...updatedOrder,
        items: itemResults,
      };
      callback(null, orderWithItems);
    });
  });
};

// ✅ 4. Get Order History
const getOrderHistory = (customerId, callback) => {
  const query = `
    SELECT o.*, oi.item_name, oi.quantity, oi.price, oi.image_url
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.customer_id = ?
    ORDER BY o.order_date_time DESC
  `;
  db.query(query, [customerId], callback);
};

// ✅ 5. Clear Cart
const clearCart = (customerId, callback) => {
  const query = "DELETE FROM cart WHERE customer_id = ?";
  db.query(query, [customerId], callback);
};

// ✅ 6. Get Orders by Restaurant
const getOrdersByRestaurantId = (restaurantId, callback) => {
  const query = `
    SELECT o.*, u.username AS customer_name, u.email AS customer_email
    FROM orders o
    JOIN users u ON o.customer_id = u.customer_id
    WHERE o.restaurant_id = ?
    ORDER BY o.order_date_time DESC
  `;
  db.query(query, [restaurantId], callback);
};

// ✅ 7. Update Order Status
const updateOrderStatus = (orderId, newStatus, callback) => {
  const query = "UPDATE orders SET order_status = ? WHERE order_id = ?";
  db.query(query, [newStatus, orderId], callback);
};

// ✅ 8. Cancel Order
const cancelOrder = (orderId, reason, callback) => {
  const query = `
    UPDATE orders 
    SET order_status = 'Cancelled', cancel_reason = ?
    WHERE order_id = ? AND order_status NOT IN ('Delivered', 'Cancelled')
  `;
  db.query(query, [reason, orderId], callback);
};

// ✅ 9. Get All Orders
const getOrders = (callback) => {
  const query = `
    SELECT o.*, u.username AS customer_name, u.email AS customer_email,
           oi.item_name, oi.quantity, oi.price, oi.image_url
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN users u ON o.customer_id = u.customer_id
    ORDER BY o.order_date_time DESC
  `;
  db.query(query, callback);
};

exports.getAllOrders = (req, res) => {
  orderModel.getOrders((err, results) => {
    if (err) {
      console.error("Error fetching all orders:", err);
      return res.status(500).json({ message: "Error fetching all orders" });
    }

    // Map DB rows to structure expected by frontend
    const formatted = results.map(order => ({
      _id: order.order_id,
      status: order.order_status,
      paymentMethod: order.paymentmethod,
      totalAmount: order.total_price,
      createdAt: order.order_date_time,
      deliveryDate: order.delivery_date_time,
      deliveryAddress: order.deliveryAddress,
      restaurantId: { name: order.restaurant_name },
      userId: { name: order.customer_name, phone: order.customer_phone },
    }));

    res.status(200).json({ orders: formatted });
  });
};

exports.getOrders = (callback) => {
  const sql = `
    SELECT 
      o.order_id,
      o.total_price,
      o.order_status,
      o.paymentmethod,
      o.order_date_time,
      o.delivery_date_time,
      o.delivery_address_ AS deliveryAddress,
      r.restaurant_id,
      r.name AS restaurant_name,
      u.customer_id,
      u.name AS customer_name,
      u.phone AS customer_phone
    FROM orders o
    JOIN restaurants r ON o.restaurant_id = r.restaurant_id
    JOIN users u ON o.customer_id = u.customer_id
    ORDER BY o.order_date_time DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};
// superadminorders
const getSuperOrdersByRestaurantId = (restaurantId, callback) => {
  const query = `
    SELECT o.*, u.username AS customer_name
    FROM orders o
    JOIN users u ON o.customer_id = u.customer_id
    WHERE o.restaurant_id = ?
    ORDER BY o.order_date_time DESC
  `;
  db.query(query, [restaurantId], callback);
};

module.exports = {
  createOrder,
  getOrderHistory,
  clearCart,
  cancelOrder,
  getOrders,
  getOrdersByRestaurantId,
  updateOrderStatus,
  trackOrderById,
  autoUpdateOrderStatus,
  getOrders,
  getSuperOrdersByRestaurantId
};

