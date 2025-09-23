const express = require("express");
const router = express.Router();
const CartController = require("../controller/cartController");

// Add item to cart
router.post("/add", CartController.addToCart);

// Get cart by customer ID
router.get("/:customerId", CartController.getCart);

// Delete all items for customer
router.delete("/clear/:customerId", CartController.deleteCartByCustomer);

// Delete one item by cart ID
router.delete("/item/:cartId", CartController.deleteCartItem);

// New routes
router.put("/update/:cartId", CartController.updateCartQuantity);
module.exports = router;
