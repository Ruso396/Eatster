const db = require("../db");

exports.addTracking = (req, res) => {
  const { order_id, order_name, image_url, order_current_status } = req.body;
  const sql = "INSERT INTO tracking (order_id, order_name, image_url, order_current_status) VALUES (?, ?, ?, ?)";
  db.query(sql, [order_id, order_name, image_url, order_current_status], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Tracking started", id: result.insertId });
  });
};

exports.getTrackingByOrderId = (req, res) => {
  const sql = "SELECT * FROM tracking WHERE order_id = ?";
  db.query(sql, [req.params.order_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

exports.updateTrackingStatus = (req, res) => {
  const { order_current_status } = req.body;
  const sql = "UPDATE tracking SET order_current_status = ?, updated_at = NOW() WHERE order_id = ?";
  db.query(sql, [order_current_status, req.params.order_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Status updated" });
  });
};