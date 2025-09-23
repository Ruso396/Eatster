const express = require("express");
const router = express.Router();
const searchController = require("../controller/searchController");

router.get("/suggestions", searchController.getSuggestions);

module.exports = router; // ✅ this line is required!
