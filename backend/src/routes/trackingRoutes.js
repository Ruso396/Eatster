const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");

router.post("/", trackingController.addTracking);
router.get("/:order_id", trackingController.getTrackingByOrderId);
router.put("/:order_id", trackingController.updateTrackingStatus);

module.exports = router;