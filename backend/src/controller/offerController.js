const multer = require("multer");
const path = require("path");
const offerModel = require("../model/offerModel");
const fs = require('fs');

// ✅ 1. Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/offers/"); // make sure this folder exists!
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `offer_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// ✅ 2. Middleware to handle image upload
exports.uploadOfferImage = upload.single("image");

// ✅ 3. Add Offer
exports.addOffer = (req, res) => {
  const activeValue = req.body.active === "true" || req.body.active === true ? 1 : 0;

  const offerData = {
    restaurant_id: req.body.restaurant_id,
    title: req.body.title,
    description: req.body.description,
    discount_percent: req.body.discount_percent,
    valid_from: req.body.valid_from,
    valid_to: req.body.valid_to,
    active: activeValue, // ✅ convert 'true' to 1
    image_url: req.file ? `/uploads/offers/${req.file.filename}` : null,
    price: req.body.price,
    foodname: req.body.foodname
  };

  offerModel.addOffer(offerData, (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Failed to add offer" });
    }
    res.json({ success: true, offerId: result.insertId });
  });
};

// ✅ 4. Get Offers by restaurant_id
exports.getOffersByRestaurantId = (req, res) => {
  offerModel.getOffersByRestaurantId(req.params.restaurantId, (err, offers) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Failed to fetch offers" });
    }
    res.json(offers);
  });
};

// Delete offer
exports.deleteOffer = (req, res) => {
  const offerId = req.params.offerId;
  // Get image path to delete file
  offerModel.getOffersByRestaurantId(req.body.restaurant_id || 0, (err, offers) => {
    const offer = offers.find(o => o.id == offerId);
    if (offer && offer.image_url) {
      const fullPath = path.join(__dirname, '../../', offer.image_url);
      fs.unlink(fullPath, () => {});
    }
    offerModel.deleteOffer(offerId, (err2) => {
      if (err2) return res.status(500).json({ error: 'Failed to delete offer' });
      res.json({ success: true });
    });
  });
};

// Update offer
exports.updateOffer = [
  upload.single('image'),
  (req, res) => {
    const offerId = req.params.offerId;
    // Get old offer for old image
    offerModel.getOffersByRestaurantId(req.body.restaurant_id || 0, (err, offers) => {
      const oldOffer = offers.find(o => o.id == offerId);
      const activeValue = req.body.active === "true" || req.body.active === true ? 1 : 0;
      const offerData = {
        title: req.body.title,
        description: req.body.description,
        discount_percent: req.body.discount_percent,
        valid_from: req.body.valid_from,
        valid_to: req.body.valid_to,
        active: activeValue,
        image_url: req.file ? `/uploads/offers/${req.file.filename}` : (oldOffer ? oldOffer.image_url : null),
        price: req.body.price,
        foodname: req.body.foodname
      };
      offerModel.updateOffer(offerId, offerData, (err2) => {
        if (err2) return res.status(500).json({ error: 'Failed to update offer' });
        // Delete old image if replaced
        if (req.file && oldOffer && oldOffer.image_url) {
          const fullPath = path.join(__dirname, '../../', oldOffer.image_url);
          fs.unlink(fullPath, () => {});
        }
        res.json({ success: true });
      });
    });
  }
];

exports.getAllOffers = (req, res) => {
  offerModel.getAllOffersWithRestaurant((err, offers) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Failed to fetch all offers" });
    }
    res.json(offers);
  });
};
