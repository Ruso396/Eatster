// const express = require("express");
// const router = express.Router();
// const menuController = require("../controller/menuController");

// router.get("/", menuController.getAllMenu);
// router.get("/:id", menuController.getMenuById);

// router.post("/", menuController.addMenu);

// router.put("/:id", menuController.updateMenu);

// router.delete("/:id", menuController.deleteMenu);
// // router.get("/restaurants/nearby-with-food", menuController.getRestaurantsByFoodNearby);

// module.exports = router;




// ✅ File: routes/menuRoutes.js

const express = require("express");
const router = express.Router();
const menuController = require("../controller/menuController");
const multer = require("multer");
const path = require("path");

// ✅ Setup Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    // ✅ Use foodname from form input
    const ext = path.extname(file.originalname); // e.g. '.jpeg'
    const foodname = req.body.foodname.trim().replace(/\s+/g, "_"); // 'rasam rice' => 'rasam_rice'
    cb(null, `${foodname}${ext}`);
  },
});

const upload = multer({ storage });

router.get("/", menuController.getAllMenu);
router.get("/:id", menuController.getMenuById);
router.post("/", upload.single("img"), menuController.addMenu);
router.put("/:id", upload.single("img"), menuController.updateMenu);
router.delete("/:id", menuController.deleteMenu);

module.exports = router;