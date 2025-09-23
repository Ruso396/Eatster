const db = require("../config/db");

exports.getOrder = async (orderId) => {
  const [rows] = await db.promise().query(
    "SELECT * FROM orders WHERE order_id = ?",
    [orderId]
  );
  return rows[0];
};

exports.getOrderItems = async (orderId) => {
  const [rows] = await db.promise().query(
    `SELECT item_name, quantity, price, image_url 
     FROM order_items WHERE order_id = ?`,
    [orderId]
  );
  return rows;
};
exports.createInvoice = async (invoiceData) => {
  const {
    order_id,
    invoice_id,
    restaurant_id,       // ✅ added
    customer_id,
    customer_name,       // ✅ added
    customer_email,      // ✅ added
    delivery_address,
    payment_method,
    total_price,
    gst,
    total_with_gst,
    status,
  } = invoiceData;

  await db.promise().query(
    `INSERT INTO restaurant_invoices 
     (order_id, invoice_id, restaurant_id, customer_id, customer_name, customer_email, 
      delivery_address, payment_method, total_price, gst, total_with_gst, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order_id,
      invoice_id,
      restaurant_id,
      customer_id,
      customer_name,
      customer_email,
      delivery_address,
      payment_method,
      total_price,
      gst,
      total_with_gst,
      status,
    ]
  );
};


exports.insertInvoiceItems = async (itemsArray) => {
  await db.promise().query(
    `INSERT INTO restaurant_invoice_items 
     (invoice_id, order_id, item_name, quantity, unit_price, total_price, image_url)
     VALUES ?`,
    [itemsArray]
  );
};

exports.updateOrderInvoice = async (orderId, invoiceId) => {
  await db.promise().query(
    "UPDATE orders SET invoice_id = ? WHERE order_id = ?",
    [invoiceId, orderId]
  );
};
