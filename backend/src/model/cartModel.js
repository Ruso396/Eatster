const db = require("../config/db");

const CartModel = {
  addItem: (customer_id, restaurant_id, item_id, item_name, foodname, price, quantity, image_url, callback) => {
    db.query(
      "SELECT * FROM cart_items WHERE customer_id = ? AND item_id = ?",
      [customer_id, item_id],
      (err, results) => {
        if (err) return callback(err);

        if (results.length > 0) {
          db.query(
            "UPDATE cart_items SET quantity = quantity + 1 WHERE customer_id = ? AND item_id = ?",
            [customer_id, item_id],
            callback
          );
        } else {
          db.query(
            "INSERT INTO cart_items (customer_id, restaurant_id, item_id, item_name, foodname, price, quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [customer_id, restaurant_id, item_id, item_name, foodname, price, quantity, image_url],
            callback
          );
        }
      }
    );
  }
  ,

  getCartByCustomerId: (customer_id, callback) => {
    db.query("SELECT * FROM cart_items WHERE customer_id = ?", [customer_id], callback);
  },

  deleteCartByCustomerId: (customer_id, callback) => {
    db.query("DELETE FROM cart_items WHERE customer_id = ?", [customer_id], callback);
  },

  deleteItemById: (cartId, callback) => {
    db.query("DELETE FROM cart_items WHERE id = ?", [cartId], callback);
  },
  updateQuantity: (cartId, quantity, callback) => {
    db.query(
      "UPDATE cart_items SET quantity = ? WHERE id = ?",
      [quantity, cartId],
      callback
    );
  },
};

module.exports = CartModel;
