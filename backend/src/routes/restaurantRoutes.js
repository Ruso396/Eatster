const express = require("express");
const router = express.Router();
const controller = require("../controller/restaurantController");
const upload = require("../middlewares/upload"); // Assuming 'upload' middleware is configured for file storage

router.get("/", controller.getAll);

// NEW: Route to get a single restaurant's details by email
router.get("/details/:email", controller.getRestaurantByEmail);

// NEW: Route to update restaurant details by email
router.put("/details/:email", controller.updateRestaurantDetails);

// NEW: Route to update bank details by email (can use the same updateRestaurantDetailsByEmail if fields are disjoint)
router.put("/bank-details/:email", controller.updateBankDetails);

router.get("/nearby-with-food", controller.getNearbyByFood);

router.get("/nearby-by-menu-item", controller.getNearbyByMenuItem);



router.post("/", upload.fields([
  { name: "foodImages", maxCount: 12 },
]), controller.create);

// Routes for email actions
router.get("/action/accept/:token", controller.acceptRestaurant);
router.get("/action/cancel/:token", controller.cancelRestaurant);

// NEW: Menu Management Routes
router.get("/:restaurantId/menu-items", controller.getMenuItems);
router.post("/:restaurantId/menu-items", upload.single('itemImage'), controller.addMenuItem); // Added upload.single for image
router.put("/:restaurantId/menu-items/:itemId", upload.single('itemImage'), controller.updateMenuItem); // Added upload.single for image
router.delete("/:restaurantId/menu-items/:itemId", controller.deleteMenuItem);

router.put('/make-admin/:id', controller.makeAdmin);

// --- Banner Upload & Management ---
const fs = require('fs');
const path = require('path');

// Upload banner
router.post('/banners', upload.single('banner'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Save banner info to DB if needed
  res.json({ success: true, image_url: `/uploads/banners/${req.file.filename}` });
});

// Get all banners for a restaurant
router.get('/:restaurantId/banners', (req, res) => {
  // TODO: Fetch banners from DB for restaurantId
  res.json([]); // Placeholder
});

// Get all banners (global)
router.get('/banners-all', controller.getAllBanners);

// Delete a banner
router.delete('/banners/:bannerId', (req, res) => {
  // TODO: Delete banner from DB and filesystem
  res.json({ success: true });
});

// Update a banner (replace image)
router.put('/banners/:bannerId', upload.single('banner'), (req, res) => {
  // TODO: Update banner image in DB and filesystem
  res.json({ success: true });
});


module.exports = router;