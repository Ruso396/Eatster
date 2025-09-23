const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;
    switch (file.fieldname) {
      case "foodImages":
        folder = "uploads/food_images";
        break;
      case "itemImage":
        folder = "uploads/menu_items";
        break;
      case "menuFile":
        folder = "uploads/menus";
        break;
      case "profile_picture":
        folder = "uploads/profiles";
        break;
      default:
        folder = "uploads/images"; // A generic fallback
    }

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    // Create a more unique filename to avoid potential collisions
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

module.exports = upload;
