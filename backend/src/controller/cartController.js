const CartModel = require("../model/cartModel");

const CartController = {
  addToCart: (req, res) => {
const { customer_id, restaurant_id, item_id, item_name, foodname, price, quantity, image_url } = req.body;

CartModel.addItem(customer_id, restaurant_id, item_id, item_name, foodname, price, quantity, image_url, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Failed to add to cart" });
      }
      res.json({ success: true, message: "Item added to cart" });
    });
  },

  getCart: (req, res) => {
    const { customerId } = req.params;

    CartModel.getCartByCustomerId(customerId, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Failed to fetch cart" });
      }
      res.json(results);
    });
  },

  deleteCartByCustomer: (req, res) => {
    const { customerId } = req.params;

    CartModel.deleteCartByCustomerId(customerId, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Failed to delete cart" });
      }
      res.json({ success: true, message: "Cart cleared" });
    });
  },

  deleteCartItem: (req, res) => {
    const { cartId } = req.params;

    CartModel.deleteItemById(cartId, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Failed to delete item" });
      }
      res.json({ success: true, message: "Item removed" });
    });
  },

  
  updateCartQuantity: (req, res) => {
    const { cartId } = req.params;
    const { quantity } = req.body;

    CartModel.updateQuantity(cartId, quantity, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Failed to update quantity" });
      }
      res.json({ success: true, message: "Quantity updated" });
    });
  },

};

module.exports = CartController;
