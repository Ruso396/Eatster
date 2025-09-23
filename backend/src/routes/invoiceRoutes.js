// const express = require("express");
// const router = express.Router();
// const invoiceController = require("../controller/invoiceController");

// router.get("/:orderId", invoiceController.generateInvoice);

// module.exports = router;
const express = require("express");
const router = express.Router();
const invoiceController = require("../controller/invoiceController");

router.get("/:orderId", invoiceController.generateInvoice);
router.get("/restaurant/:restaurantId", invoiceController.getInvoicesByRestaurant);

module.exports = router;
