const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create HTTP server and attach Socket.IO
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, {
  cors: {
    origin: "*", // 🔁 Replace with frontend URL in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// ✅ Attach io to req so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Static file routes
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static("public/images"));

// ✅ API routes
const userRoutes = require('./src/routes/userRoutes');
const menuRoutes = require("./src/routes/menuRoutes");
const restaurantRoutes = require("./src/routes/restaurantRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const superAdminRoutes = require("./src/routes/superAdminRoutes");
const offerRoutes = require("./src/routes/offerRoutes");
const invoiceRoutes = require("./src/routes/invoiceRoutes");
 const searchRoutes = require("./src/routes/searchRoutes");

// ✅ Pass io to cart routes (optional: useful if routes want direct socket access)
// ✅ Pass io to order routes (optional: useful if routes want direct socket access)
const orderRoutes = require("./src/routes/orderRoutes");

app.use("/api/restaurants", restaurantRoutes);
app.use("/api", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/orders", orderRoutes); // io is already available on req
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/search",searchRoutes)

// ✅ Start the HTTP server
http.listen(5000, () => {
  console.log('✅ Server started on https://eatster-pro.onrender.com');
});
