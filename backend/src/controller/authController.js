const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

// ✅ Login for all roles (admin, superadmin, user)
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM user WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    // ✅ Generate JWT token with restaurant_id (if exists) & role
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        restaurant_id: user.restaurant_id || null, // 👈 null-safe
      },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: "1d" }
    );

    // ✅ Respond with token and user info
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurant_id: user.restaurant_id || null,
      },
    });
  });
};

















// const bcrypt = require("bcrypt");
// const db = require("../db");

// // ✅ Register - only user role allowed from UI
// exports.registerUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   const role = 'user'; // Force role to 'user' always

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const sql = "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)";
//     db.query(sql, [name, email, hashedPassword, role], (err, result) => {
//       if (err) {
//         console.error("Register error:", err);
//         return res.status(500).json({ message: "Database error" });
//       }
//       res.json({ message: "User registered successfully" });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ Secret route to create admin/superadmin
// exports.secretRegister = async (req, res) => {
//   const { name, email, password, role, secretKey } = req.body;

//   if (secretKey !== "jesiSecret123") {
//     return res.status(403).json({ message: "Unauthorized access" });
//   }

//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ message: "All fields required" });
//   }

//   if (!["admin", "superadmin"].includes(role)) {
//     return res.status(400).json({ message: "Invalid role" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const sql = "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)";
//     db.query(sql, [name, email, hashedPassword, role], (err, result) => {
//       if (err) {
//         console.error("Admin creation error:", err);
//         return res.status(500).json({ message: "DB error" });
//       }
//       res.json({ message: `${role} registered successfully!` });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ Login (for all roles)
// exports.loginUser = (req, res) => {
//   const { email, password } = req.body;

//   const sql = "SELECT * FROM user WHERE email = ?";
//   db.query(sql, [email], async (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error" });
//     if (results.length === 0) return res.status(404).json({ message: "User not found" });

//     const user = results[0];
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ message: "Invalid password" });

//     res.json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   });
// };
