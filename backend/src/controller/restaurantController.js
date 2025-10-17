require('dotenv').config();
const restaurantModel = require("../model/restaurantModel");
const nodemailer = require("nodemailer");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ✅ Mail setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Get All Restaurants
exports.getAll = (req, res) => {
  restaurantModel.getAllRestaurants((err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// ✅ Get Single Restaurant Details by Email
exports.getRestaurantByEmail = (req, res) => {
  const { email } = req.params; // Get email from URL parameters
  restaurantModel.getRestaurantByEmail(email, (err, results) => {
    if (err) {
      console.error("Error fetching restaurant by email:", err);
      return res.status(500).json({ message: "Error fetching restaurant details." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Restaurant not found." });
    }
    res.json(results[0]); // Send the first (and should be only) result
  });
};

// ✅ Update Restaurant Details by Email
exports.updateRestaurantDetails = (req, res) => {
  const { email } = req.params;
  const updateData = req.body; // Data to update, e.g., { name: 'New Name', mobile: '1234567890', address: 'New Address' }

  // Remove email from updateData if it's accidentally sent, as email is the identifier
  delete updateData.email;

  restaurantModel.updateRestaurantDetailsByEmail(email, updateData, (err, result) => {
    if (err) {
      console.error("Error updating restaurant details:", err);
      return res.status(500).json({ message: "Failed to update restaurant details." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Restaurant not found or no changes made." });
    }
    res.json({ message: "Restaurant details updated successfully." });
  });
};

// ✅ Update Bank Details by Email
exports.updateBankDetails = (req, res) => {
  const { email } = req.params;
  const updateData = req.body; // e.g., { account_name: 'New Name', account_number: '...', ifsc: '...' }

  restaurantModel.updateRestaurantDetailsByEmail(email, updateData, (err, result) => {
    if (err) {
      console.error("Error updating bank details:", err);
      return res.status(500).json({ message: "Failed to update bank details." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Restaurant not found or no changes made." });
    }
    res.json({ message: "Bank details updated successfully." });
  });
};


// ✅ Get Nearby by Food
exports.getNearbyByFood = (req, res) => {
  const { lat, lng, radius = 15, food } = req.query;
  if (!lat || !lng || !food) {
    return res.status(400).json({ error: "lat, lng and food are required" });
  }

  restaurantModel.getRestaurantsByFoodNearby(
    parseFloat(lat),
    parseFloat(lng),
    parseFloat(radius),
    food.trim().toLowerCase(),
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      const grouped = {};
      results.forEach((r) => {
        if (!grouped[r.id]) {
          const travelTime = Math.ceil((r.distance / 30) * 60);
          grouped[r.id] = {
            ...r,
            travel_time: travelTime,
            estimated_delivery_time: r.preparation_time + travelTime,
            food_categories: [],
          };
        }
        grouped[r.id].food_categories.push({
          name: r.category_name,
          image_url: r.image_url,
        });
      });

      res.json(Object.values(grouped));
    }
  );
};

// ✅ Get Nearby by Menu Item
exports.getNearbyByMenuItem = (req, res) => {
  const { lat, lng, radius = 15, foodName } = req.query;
  if (!lat || !lng || !foodName) {
    return res.status(400).json({ error: "lat, lng and foodName are required" });
  }

  restaurantModel.getRestaurantsByMenuItemNearby(
    parseFloat(lat),
    parseFloat(lng),
    parseFloat(radius),
    foodName,
    (err, results) => {
      console.log('Query Parameters:', { lat, lng, radius, foodName });
      if (err) {
        console.error("Error fetching nearby restaurants by menu item:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      
      console.log('Query Results:', results);

      // The query now returns unique restaurants with the first matching image
      const restaurantsWithDeliveryTime = results.map(r => {
        const travelTime = Math.ceil((r.distance / 30) * 60); // Assume 30km/h average speed
        return {
          ...r,
          estimated_delivery_time: r.preparation_time + travelTime,
        };
      });

      res.json(restaurantsWithDeliveryTime);
    }
  );
};


// ✅ Register Restaurant
exports.create = (req, res) => {
  const data = req.body;
  const categoriesWithFileNames = JSON.parse(data.selectedFoodCategoriesData || "[]");
  const uploadedFoodImages = req.files?.foodImages || [];

  delete data.selectedFoodCategoriesData;

  // ✅ Hash the password
  bcrypt.hash(data.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("❌ Error hashing password:", err);
      return res.status(500).send("Error hashing password");
    }

    data.password = hashedPassword;

    restaurantModel.createRestaurant(data, (err, result) => {
      if (err) {
        console.error("Error creating restaurant:", err);
        return res.status(500).send(err);
      }

      const restaurantId = result.insertId;

      const categoriesToInsert = categoriesWithFileNames.map((catData) => {
        const uploadedFile = uploadedFoodImages.find(
          (file) => file.originalname === catData.originalFileName
        );
        return {
          name: catData.name,
          imageUrl: uploadedFile ? `uploads/food_images/${uploadedFile.filename}` : null,
        };
      });

      restaurantModel.addFoodCategories(restaurantId, categoriesToInsert, (catErr) => {
        if (catErr) {
          console.error("Food category insert error:", catErr);
          return res.status(500).send(catErr);
        }

        const adminEmail = "kalamruso2004@gmail.com";
        const baseUrl = process.env.BASE_URL || "https://eatster-nine.vercel.app";

        Promise.all([
          restaurantModel.generateAndStoreToken(restaurantId, 'accept'),
          restaurantModel.generateAndStoreToken(restaurantId, 'cancel'),
        ])
          .then(([acceptToken, cancelToken]) => {
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: adminEmail,
              subject: `New Restaurant Registered: ${data.name}`,
              html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                    <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; border-bottom: 5px solid #0056b3;">
                        <h2 style="margin: 0;">New Restaurant Registration!</h2>
                    </div>
                    <div style="padding: 25px;">
                        <p style="font-size: 16px;">A new restaurant has registered on your platform. Here are the details:</p>
                        <ul style="list-style: none; padding: 0; margin: 20px 0;">
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>Restaurant Name:</strong> ${data.name}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>Owner Name:</strong> ${data.owner}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>Mobile:</strong> ${data.mobile}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>Email:</strong> ${data.email}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>City:</strong> ${data.city}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>Pincode:</strong> ${data.pincode}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>Address:</strong> ${data.address}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>Latitude:</strong> ${data.latitude}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>Longitude:</strong> ${data.longitude}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>FSSAI:</strong> ${data.fssai}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>GSTIN:</strong> ${data.gstin}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>PAN:</strong> ${data.pan}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>Account Name:</strong> ${data.account_name}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>Account Number:</strong> ${data.account_number}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>IFSC:</strong> ${data.ifsc}</li>
                            <li style="margin-bottom: 10px; padding: 8px 12px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px;"><strong>Status:</strong> Pending</li>
                        </ul>
                        <p style="font-size: 16px;"><strong>Food Categories:</strong> ${categoriesToInsert.map(c => c.name).join(', ')}</p>
                        <p style="font-size: 18px; font-weight: bold; margin-top: 30px;">Please take action:</p>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <tr>
                                <td style="text-align: center; padding: 10px;">
                                    <a href="${baseUrl}/api/restaurants/action/accept/${acceptToken}" style="display: inline-block; padding: 12px 25px; background-color: #28a745; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; transition: background-color 0.3s ease;">Accept</a>
                                </td>
                                <td style="text-align: center; padding: 10px;">
                                    <a href="${baseUrl}/api/restaurants/action/cancel/${cancelToken}" style="display: inline-block; padding: 12px 25px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; transition: background-color 0.3s ease;">Cancel</a>
                                </td>
                            </tr>
                        </table>
                        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">Note: These links are valid for 24 hours and can be used once.</p>
                    </div>
                    <div style="background-color: #f0f0f0; color: #555; padding: 15px; text-align: center; font-size: 12px; border-top: 1px solid #eee;">
                        &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
                    </div>
                </div>
                `,
            };

            transporter.sendMail(mailOptions, (mailErr, info) => {
              if (mailErr) console.error("❌ Mail send error:", mailErr);
              else console.log("✅ Mail sent to Superadmin:", info.response);
            });
          })
          .catch((tokenErr) => {
            console.error("Token error:", tokenErr);
          });

        // ✅ Insert user with restaurant_id only
        const insertUserSQL = `
          INSERT INTO users (username, email, password, role, status, restaurant_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
          insertUserSQL,
          [
            data.owner,
            data.email,
            data.password,
            'user', // Initially 'user' until approved, then 'admin'
            'pending',
            restaurantId,
          ],
          (userErr) => {
            if (userErr) {
              console.error("❌ User insert error:", userErr);
            } else {
              console.log("✅ User inserted with restaurant_id");
            }

            res.status(201).json({
              id: restaurantId,
              ...data,
              foodCategories: categoriesToInsert,
            });
          }
        );
      });
    });
  });
};

// ✅ Accept / Cancel Handler
const handleRestaurantAction = (actionType) => (req, res) => {
  const { token } = req.params;

  restaurantModel.getRestaurantByToken(token, actionType, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send(`
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 50px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 8px; max-width: 600px; margin: 50px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #dc3545; font-size: 48px; margin-bottom: 20px;">&#x2716;</h1>
            <h2 style="margin-bottom: 20px;">Action Failed!</h2>
            <p style="font-size: 18px;">Invalid or expired link. Please contact support if you believe this is an error.</p>
        </div>
      `);
    }

    const restaurant = results[0];
    if (restaurant.used) return res.status(400).send(`
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 50px; background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; border-radius: 8px; max-width: 600px; margin: 50px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #ffc107; font-size: 48px; margin-bottom: 20px;">&#9888;</h1>
            <h2 style="margin-bottom: 20px;">Link Already Used!</h2>
            <p style="font-size: 18px;">This action link has already been used. No further action can be taken with this link.</p>
        </div>
      `);
    if (new Date() > new Date(restaurant.expires_at)) return res.status(400).send(`
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 50px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 8px; max-width: 600px; margin: 50px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #dc3545; font-size: 48px; margin-bottom: 20px;">&#x2716;</h1>
            <h2 style="margin-bottom: 20px;">Link Expired!</h2>
            <p style="font-size: 18px;">This action link has expired. Please request a new link if necessary.</p>
        </div>
      `);

    let newStatus;
    let iconHtml;
    let messageColor;
    let backgroundColor;
    let borderColor;
    let headerColor;

    if (actionType === "accept") {
      newStatus = "accepted";
      iconHtml = '<span style="font-size: 60px; color: #28a745; display: block; margin-bottom: 20px;">&#10004;</span>'; // Checkmark
      messageColor = '#155724';
      backgroundColor = '#d4edda';
      borderColor = '#c3e6cb';
      headerColor = '#28a745';
    } else if (actionType === "cancel") {
      newStatus = "cancelled";
      iconHtml = '<span style="font-size: 60px; color: #dc3545; display: block; margin-bottom: 20px;">&#10006;</span>'; // X mark
      messageColor = '#721c24';
      backgroundColor = '#f8d7da';
      borderColor = '#f5c6cb';
      headerColor = '#dc3545';
    }

    restaurantModel.updateRestaurantStatus(restaurant.id, newStatus, (updateErr) => {
      if (updateErr) return res.status(500).send(`
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 50px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 8px; max-width: 600px; margin: 50px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #dc3545; font-size: 48px; margin-bottom: 20px;">&#x2716;</h1>
            <h2 style="margin-bottom: 20px;">Action Failed!</h2>
            <p style="font-size: 18px;">Could not update restaurant status. Please try again later or contact support.</p>
        </div>
      `);

      restaurantModel.markTokenAsUsed(token, (markErr) => {
        if (markErr) console.error("Token mark error:", markErr);

        if (newStatus === 'accepted') {
          const updateUserSQL = `
            UPDATE users SET role = 'admin', status = 'active' WHERE email = ?
          `;
          db.query(updateUserSQL, [restaurant.email], (roleErr) => {
            if (roleErr) console.error("❌ Role/status update failed:", roleErr);
            else console.log("✅ User updated to admin and active");
          });

          const ownerMailOptions = {
            from: process.env.EMAIL_USER,
            to: restaurant.email,
            subject: "🎉 Your Restaurant is Approved!",
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #d4edda; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                  <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; border-bottom: 5px solid #218838;">
                      <h2 style="margin: 0;">Congratulations ${restaurant.owner}!</h2>
                  </div>
                  <div style="padding: 25px;">
                      <p style="font-size: 16px;">Your restaurant <strong>${restaurant.name}</strong> has been successfully approved and is now active on our platform.</p>
                      <p style="font-size: 16px;">You can now login and manage your dashboard to set up your menu, operating hours, and more!</p>
                      <p style="text-align: center; margin-top: 30px;">
                          <a href="${process.env.LOGIN_URL}" style="display:inline-block; padding:15px 30px; background-color:#007bff; color:white; border-radius:8px; text-decoration:none; font-weight: bold; font-size: 18px; transition: background-color 0.3s ease;">
                              🔐 Login to Your Dashboard
                          </a>
                      </p>
                      <p style="font-size: 14px; color: #555; text-align: center; margin-top: 20px;">Your login email: <strong>${restaurant.email}</strong></p>
                  </div>
                  <div style="background-color: #f0f0f0; color: #555; padding: 15px; text-align: center; font-size: 12px; border-top: 1px solid #eee;">
                      Thank you for joining us!
                  </div>
              </div>
            `,
          };

          transporter.sendMail(ownerMailOptions, (mailErr, info) => {
            if (mailErr) console.error("❌ Login mail failed:", mailErr);
            else console.log("✅ Login mail sent:", info.response);
          });
        }

        res.send(`
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 50px; background-color: ${backgroundColor}; color: ${messageColor}; border: 1px solid ${borderColor}; border-radius: 8px; max-width: 600px; margin: 50px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              ${iconHtml}
              <h2 style="color: ${headerColor}; margin-bottom: 20px;">Restaurant ${actionType === 'accept' ? 'Approved' : 'Cancelled'}!</h2>
              <p style="font-size: 18px;">The restaurant <strong>${restaurant.name}</strong> has been successfully marked as <strong>${newStatus}</strong>.</p>
              <p style="font-size: 16px; margin-top: 30px; color: #555;">You can close this window now.</p>
          </div>
        `);
      });
    });
  });
};

exports.acceptRestaurant = handleRestaurantAction("accept");
exports.cancelRestaurant = handleRestaurantAction("cancel");


// NEW: Get Menu Items for a Restaurant
exports.getMenuItems = (req, res) => {
  const { restaurantId } = req.params;
  restaurantModel.getMenuItemsByRestaurantId(restaurantId, (err, results) => {
    if (err) {
      console.error("Error fetching menu items:", err);
      return res.status(500).json({ message: "Failed to fetch menu items." });
    }
    res.json(results);
  });
};

const sanitizeHtml = require('sanitize-html');

// NEW: Add Menu Item
exports.addMenuItem = (req, res) => {
  const { restaurantId } = req.params;
  const { name, category, price, available } = req.body;
  const imageUrl = req.file ? `uploads/menu_items/${req.file.filename}` : null;

  // Sanitize user input to prevent XSS
  const cleanName = sanitizeHtml(name, {
    allowedTags: [],
    allowedAttributes: {}
  });

  const cleanCategory = sanitizeHtml(category, {
    allowedTags: [],
    allowedAttributes: {}
  });

  if (!cleanName || !cleanCategory || !price) {
    return res.status(400).json({ message: "Name, category, and price are required." });
  }

  const item = {
    name: cleanName,
    category: cleanCategory,
    price: parseFloat(price),
    available: available === 'true' ? 1 : 0,
    imageUrl,
  };

  restaurantModel.addMenuItem(restaurantId, item, (err, result) => {
    if (err) {
      console.error("Error adding menu item:", err);
      return res.status(500).json({ message: "Failed to add menu item." });
    }
    res.status(201).json({ id: result.insertId, ...item, restaurant_id: parseInt(restaurantId) });
  });
};

// NEW: Update Menu Item
exports.updateMenuItem = (req, res) => {
  const { restaurantId, itemId } = req.params;
  const { name, category, price, available } = req.body;
  const imageUrl = req.file ? `uploads/menu_items/${req.file.filename}` : req.body.existingImage; // Handle new upload or keep existing

  if (!name || !category || !price) {
    return res.status(400).json({ message: "Name, category, and price are required." });
  }

  const item = {
    name,
    category,
    price: parseFloat(price),
    available: available === 'true' ? 1 : 0,
    imageUrl,
  };

  restaurantModel.updateMenuItem(itemId, item, (err, result) => {
    if (err) {
      console.error("Error updating menu item:", err);
      return res.status(500).json({ message: "Failed to update menu item." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Menu item not found or no changes made." });
    }
    res.json({ message: "Menu item updated successfully.", updatedItem: { id: parseInt(itemId), ...item, restaurant_id: parseInt(restaurantId) } });
  });
};

// NEW: Delete Menu Item
exports.deleteMenuItem = (req, res) => {
  const { itemId } = req.params;
  restaurantModel.deleteMenuItem(itemId, (err, result) => {
    if (err) {
      console.error("Error deleting menu item:", err);
      return res.status(500).json({ message: "Failed to delete menu item." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Menu item not found." });
    }
    res.json({ message: "Menu item deleted successfully." });
  });
};

// ✅ Mail helper: send login link when restaurant becomes admin
const sendAdminLoginMail = (email, ownerName, restaurantName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🎉 Your Restaurant is Officially Approved!",
    html: `
      <div style="font-family:sans-serif; line-height:1.5; color:#333">
        <h2 style="color:#28a745">Congratulations, ${ownerName}!</h2>
        <p>Your restaurant <strong>${restaurantName}</strong> has been approved and is now live on our platform.</p>
        <p>You can now log in and manage your dashboard using the link below:</p>
        <a href="${process.env.LOGIN_URL}" style="display:inline-block;margin:20px 0;padding:12px 25px;background:#007bff;color:#fff;text-decoration:none;border-radius:6px;">🔐 Login to Your Dashboard</a>
        <p>If you did not expect this email, please contact support.</p>
        <hr style="margin-top:40px;opacity:0.3;">
        <p style="font-size:12px;color:#777;">Enjoy the journey!<br/>Team Restaurant Portal</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("❌ Admin login mail failed:", err);
    else console.log("✅ Admin login mail sent:", info.response);
  });
};
exports.makeAdmin = (req, res) => {
  const userId = req.params.id;

  // 1. Update role
  const sql = "UPDATE users SET role = 'admin', status = 'active' WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to promote user" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    // 2. Get user email + name
    const getUserSql = "SELECT email, username FROM users WHERE id = ?";
    db.query(getUserSql, [userId], (err2, userResult) => {
      if (err2) return res.status(500).json({ error: "Failed to get user details" });
      if (userResult.length === 0) return res.status(404).json({ error: "User not found after update" });

      const { email, username } = userResult[0];
      const loginUrl = `${process.env.LOGIN_URL}`; 

      // 3. Send email
      sendAdminLoginMail(email, username, loginUrl);

      res.json({ message: "User promoted to admin and mail sent" });
    });
  });
};

// Get all banners for all restaurants
exports.getAllBanners = (req, res) => {
  restaurantModel.getAllBanners((err, banners) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Failed to fetch banners" });
    }
    res.json(banners);
  });
};

