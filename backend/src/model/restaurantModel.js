const db = require("../config/db");
const crypto = require("crypto"); // For generating secure tokens

exports.getAllRestaurants = (callback) => {
  const sql = `
    SELECT id, name, owner, mobile, email, city, pincode, address, fssai, gstin, pan, account_name, account_number, ifsc, created_at, latitude, longitude, status
    FROM restaurants
  `;
  db.query(sql, callback);
};

exports.createRestaurant = (data, callback) => {
  const restaurantData = { ...data, status: 'pending' };

  const sql = "INSERT INTO restaurants SET ?";
  db.query(sql, restaurantData, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

exports.addFoodCategories = (restaurantId, categories, callback) => {
  if (!categories || categories.length === 0) return callback(null);
  const values = categories.map((cat) => [
    restaurantId,
    cat.name,
    cat.imageUrl,
  ]);
  const sql = `
    INSERT INTO restaurant_food_categories (restaurant_id, category_name, image_url)
    VALUES ?
  `;
  db.query(sql, [values], callback);
};

exports.getRestaurantWithCategories = (callback) => {
  const sql = `
    SELECT r.id, r.name, r.owner, r.mobile, r.email, r.city, r.pincode, r.address,
      r.fssai, r.gstin, r.pan, r.account_name, r.account_number, r.ifsc,
      r.created_at, r.latitude, r.longitude, r.status,
      GROUP_CONCAT(rfc.category_name) as food_categories
    FROM restaurants r
    LEFT JOIN restaurant_food_categories rfc ON r.id = rfc.restaurant_id
    GROUP BY r.id
  `;
  db.query(sql, callback);
};

exports.getRestaurantByEmail = (email, callback) => {
  const sql = `
    SELECT id, name, owner, mobile, email, city, pincode, address, fssai, gstin, pan, account_name, account_number, ifsc, created_at, latitude, longitude, status
    FROM restaurants
    WHERE email = ?
  `;
  db.query(sql, [email], callback);
};

exports.updateRestaurantDetails = (restaurantId, data, callback) => {
  const sql = "UPDATE restaurants SET ? WHERE id = ?";
  db.query(sql, [data, restaurantId], callback);
};

// NEW: Update Restaurant Details by Email
exports.updateRestaurantDetailsByEmail = (email, data, callback) => {
  const sql = "UPDATE restaurants SET ? WHERE email = ?";
  db.query(sql, [data, email], callback);
};

// NEW: Add a menu item for a restaurant
exports.addMenuItem = (restaurantId, item, callback) => {
  const sql = `
    INSERT INTO menu_items (restaurant_id, name, category, price, available, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [restaurantId, item.name, item.category, item.price, item.available, item.imageUrl], callback);
};

// NEW: Get menu items for a specific restaurant
exports.getMenuItemsByRestaurantId = (restaurantId, callback) => {
  const sql = `
    SELECT id, restaurant_id, name, category, price, available, image_url
    FROM menu_items
    WHERE restaurant_id = ?
  `;
  db.query(sql, [restaurantId], callback);
};

// NEW: Update a menu item
exports.updateMenuItem = (menuItemId, item, callback) => {
  const sql = "UPDATE menu_items SET name = ?, category = ?, price = ?, available = ?, image_url = ? WHERE id = ?";
  db.query(sql, [item.name, item.category, item.price, item.available, item.imageUrl, menuItemId], callback);
};

// NEW: Delete a menu item
exports.deleteMenuItem = (menuItemId, callback) => {
  const sql = "DELETE FROM menu_items WHERE id = ?";
  db.query(sql, [menuItemId], callback);
};


exports.getRestaurantsByFoodNearby = (lat, lng, radius, food, callback) => {
  const sql = `
    SELECT r.id, r.name, r.owner, r.mobile, r.email, r.city, r.pincode, r.address,
      r.fssai, r.gstin, r.pan, r.account_name, r.account_number, r.ifsc,
      r.created_at, r.latitude, r.longitude, r.preparation_time, r.status,
      (6371 * ACOS(
        COS(RADIANS(?)) * COS(RADIANS(r.latitude)) *
        COS(RADIANS(r.longitude) - RADIANS(?)) +
        SIN(RADIANS(?)) * SIN(RADIANS(r.latitude))
      )) AS distance,
      fc.category_name,
      fc.image_url
    FROM restaurants r
    JOIN restaurant_food_categories fc ON r.id = fc.restaurant_id
    WHERE TRIM(LOWER(fc.category_name)) = ?
    HAVING distance <= ?
    ORDER BY distance ASC
  `;
  db.query(sql, [lat, lng, lat, food.trim().toLowerCase(), radius], callback);
};

exports.getRestaurantsByMenuItemNearby = (lat, lng, radius, foodName, callback) => {
  const searchTerm = `%${foodName.trim().toLowerCase()}%`;
  const sql = `
    SELECT
      r.id, r.name, r.owner, r.mobile, r.email, r.city, r.pincode, r.address,
      r.fssai, r.gstin, r.pan, r.account_name, r.account_number, r.ifsc,
      r.created_at, r.latitude, r.longitude, r.preparation_time, r.status,
      (6371 * ACOS(
        COS(RADIANS(?)) * COS(RADIANS(r.latitude)) *
        COS(RADIANS(r.longitude) - RADIANS(?)) +
        SIN(RADIANS(?)) * SIN(RADIANS(r.latitude))
      )) AS distance,
      (SELECT mi.image_url FROM menu_items mi WHERE mi.restaurant_id = r.id AND TRIM(LOWER(mi.name)) LIKE ? ORDER BY mi.id LIMIT 1) as image_url
    FROM restaurants r
    WHERE EXISTS (
      SELECT 1 FROM menu_items mi
      WHERE mi.restaurant_id = r.id AND TRIM(LOWER(mi.name)) LIKE ?
    )
    HAVING distance <= ?
    ORDER BY distance ASC
  `;
  db.query(sql, [lat, lng, lat, searchTerm, searchTerm, radius], callback);
};

// --- Token Generation / Verification Functions ---
exports.generateAndStoreToken = (restaurantId, type) => {
  return new Promise((resolve, reject) => {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const sql = `
      INSERT INTO restaurant_tokens (restaurant_id, token, type, expires_at)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [restaurantId, token, type, expiresAt], (err) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
};

exports.getRestaurantByToken = (token, type, callback) => {
  const sql = `
    SELECT r.*, rt.used, rt.expires_at
    FROM restaurants r
    JOIN restaurant_tokens rt ON r.id = rt.restaurant_id
    WHERE rt.token = ? AND rt.type = ?
  `;
  db.query(sql, [token, type], callback);
};

// ✅ Update restaurant status AND user status
exports.updateRestaurantStatus = (restaurantId, newStatus, callback) => {
  const sql = "UPDATE restaurants SET status = ? WHERE id = ?";
  db.query(sql, [newStatus, restaurantId], (err, result) => {
    if (err) return callback(err);

    // ✅ Update users with restaurant_id
    const userUpdateSQL = "UPDATE users SET status = ? WHERE restaurant_id = ?";
    db.query(userUpdateSQL, [newStatus, restaurantId], (userErr) => {
      if (userErr) {
        console.error("❌ Failed to update user status:", userErr);
      } else {
        console.log("✅ Updated user status to:", newStatus);
      }
      callback(userErr || null, result);
    });
  });
};

exports.markTokenAsUsed = (token, callback) => {
  const sql = "UPDATE restaurant_tokens SET used = TRUE WHERE token = ?";
  db.query(sql, [token], callback);
};

// Get all banners with restaurant info
exports.getAllBanners = (callback) => {
  const sql = `
    SELECT b.id, b.restaurant_id, b.image_url, r.name as restaurant_name
    FROM restaurant_banners b
    JOIN restaurants r ON b.restaurant_id = r.id
    ORDER BY b.id DESC
  `;
  db.query(sql, callback);
};



