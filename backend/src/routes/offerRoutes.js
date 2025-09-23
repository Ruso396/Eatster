
const express = require("express");
const router = express.Router();
const offerController = require("../controller/offerController");

router.post("/", offerController.uploadOfferImage, offerController.addOffer);
router.get("/:restaurantId", offerController.getOffersByRestaurantId);
router.get('/', offerController.getAllOffers);
router.delete('/:offerId', offerController.deleteOffer);
router.put('/:offerId', offerController.updateOffer);

module.exports = router;

