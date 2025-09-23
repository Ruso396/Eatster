

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const db = require('../config/db');
// const {
//   createUser,
//   findUserByEmail,
//   getAllUsers
// } = require('../model/userModel');

// // 🔢 Generate customer ID
// const generateCustomerId = () => {
//   return 'CUST-' + Math.floor(100000 + Math.random() * 900000);
// };

// // ✅ REGISTER
// exports.register = (req, res) => {
//   const { username, email, password, role } = req.body;

//   // Superadmin credentials
//   const SUPERADMIN_EMAIL = 'superadmin@example.com';
//   const SUPERADMIN_PASSWORD = 'SuperAdmin@123';
//   const SUPERADMIN_ROLE = 'superadmin';

//   let finalRole = 'user'; // default

//   // Assign role based on special credentials
//   if (email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
//     finalRole = SUPERADMIN_ROLE;
//   }

//   findUserByEmail(email, (err, result) => {
//     if (err) return res.status(500).json({ message: "Server error" });
//     if (result.length > 0) return res.status(400).json({ message: "User already exists" });

//     if (finalRole === SUPERADMIN_ROLE) {
//       // Allow only one superadmin
//       db.query("SELECT * FROM users WHERE role = 'superadmin'", (err2, superAdmins) => {
//         if (err2) return res.status(500).json({ message: "Server error" });
//         if (superAdmins.length > 0) {
//           return res.status(400).json({ message: "Superadmin already exists" });
//         }
//         createUserEntry();
//       });
//     } else {
//       createUserEntry();
//     }

//     // 👤 Create user logic
//     function createUserEntry() {
//       const hashedPassword = bcrypt.hashSync(password, 10);
//       const customer_id = generateCustomerId();

//       const newUser = {
//         username,
//         email,
//         password: hashedPassword,
//         customer_id,
//         role: finalRole,
//         status: 'active'
//       };

//       createUser(newUser, (err3) => {
//         if (err3) return res.status(500).json({ message: "Error creating user" });
//         res.status(201).json({
//           message: `${finalRole.charAt(0).toUpperCase() + finalRole.slice(1)} registered successfully`,
//           customer_id,
//           role: finalRole
//         });
//       });
//     }
//   });
// };

// // ✅ LOGIN
// exports.login = (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   findUserByEmail(email, (err, users) => {
//     if (err) return res.status(500).json({ message: "Server error" });
//     if (users.length === 0) return res.status(404).json({ message: "User not found" });

//     const user = users[0];

//     const isMatch = bcrypt.compareSync(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     if (user.status !== 'active') {
//       return res.status(403).json({ message: `Your account is ${user.status}` });
//     }

//     const token = jwt.sign(
//       {
//         id: user.id,
//         role: user.role,
//         customer_id: user.customer_id
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({
//       message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} login successful`,
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         customer_id: user.customer_id
//       }
//     });
//   });
// };

// // ✅ GET ALL USERS
// exports.getUsers = (req, res) => {
//   getAllUsers((err, users) => {
//     if (err) return res.status(500).json({ message: "Error retrieving users" });
//     res.status(200).json(users);
//   });
// };

// // ✅ MAKE ADMIN
// exports.makeAdmin = (req, res) => {
//   const { id } = req.params;
//   const sql = "UPDATE users SET role = 'admin' WHERE id = ?";
//   db.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ message: "User promoted to admin successfully!" });
//   });
// };
// const db = require("../config/db");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// // ✅ Register a new user
// exports.register = (req, res) => {
//   const { username, email, password, role = 'user' } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   // Check if email already exists
//   const checkSQL = "SELECT * FROM users WHERE email = ?";
//   db.query(checkSQL, [email], (checkErr, results) => {
//     if (checkErr) return res.status(500).json({ error: "Database error" });
//     if (results.length > 0) return res.status(400).json({ error: "Email already registered" });

//     // Hash the password
//     bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
//       if (hashErr) return res.status(500).json({ error: "Hashing failed" });

//       const insertSQL = `
//         INSERT INTO users (username, email, password, role, status)
//         VALUES (?, ?, ?, ?, ?)
//       `;

//       db.query(insertSQL, [username, email, hashedPassword, role, 'active'], (insertErr, result) => {
//         if (insertErr) return res.status(500).json({ error: "User registration failed" });

//         res.status(201).json({ message: "User registered successfully" });
//       });
//     });
//   });
// };

// // ✅ Login a user
// exports.login = (req, res) => {
//   const { email, password } = req.body;

//   const sql = "SELECT * FROM users WHERE email = ?";
//   db.query(sql, [email], (err, results) => {
//     if (err || results.length === 0) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     const user = results[0];

//     bcrypt.compare(password, user.password, (compareErr, isMatch) => {
//       if (compareErr || !isMatch) {
//         return res.status(401).json({ error: "Invalid email or password" });
//       }

//       const token = jwt.sign(
//         { id: user.id, email: user.email, role: user.role },
//         process.env.JWT_SECRET || "secretkey",
//         { expiresIn: "1d" }
//       );

//       res.json({
//         message: "Login successful",
//         token,
//         user: {
//           id: user.id,
//           username: user.username,
//           email: user.email,
//           role: user.role,
//           status: user.status,
//         },
//       });
//     });
//   });
// };

// // ✅ Get all users
// exports.getUsers = (req, res) => {
//   const sql = "SELECT id, username, email, role, status, created_at FROM users";
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: "Failed to fetch users" });
//     res.json(results);
//   });
// };

const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Register a new user
const register = (req, res) => {
  let { username, email, password, role = 'user' } = req.body;

  // ✅ Hardcoded superadmin details (you can change these)
  const superAdminEmail = "superadmin@example.com";
  const superAdminPassword = "SuperAdmin@123";
  const superAdminRole = "superadmin";

  // If superadmin email is used, override the values
  if (email === superAdminEmail) {
    username = "Super Admin";
    password = superAdminPassword;
    role = superAdminRole;
  }

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const checkSQL = "SELECT * FROM users WHERE email = ?";
  db.query(checkSQL, [email], (checkErr, results) => {
    if (checkErr) return res.status(500).json({ error: "Database error" });
    if (results.length > 0) return res.status(400).json({ error: "Email already registered" });

    const customer_id = role === 'user' ? `CUST-${Math.floor(100000 + Math.random() * 900000)}` : null;

    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) return res.status(500).json({ error: "Hashing failed" });

      const insertSQL = `
        INSERT INTO users (username, email, password, role, status, customer_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSQL,
        [username, email, hashedPassword, role, 'active', customer_id],
        (insertErr, result) => {
          if (insertErr) return res.status(500).json({ error: "User registration failed" });

          res.status(201).json({
            message: "User registered successfully",
            user: {
              id: result.insertId,
              username,
              email,
              role,
              status: 'active',
              customer_id
            }
          });
        }
      );
    });
  });
};

// ✅ Login a user
const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr || !isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
          customer_id: user.customer_id,
          restaurant_id: user.restaurant_id // ✅ Include this
        },
      });
    });
  });
};

// ✅ Get all users
const getUsers = (req, res) => {
  const sql = "SELECT id, username, email, role, status, customer_id, created_at FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users" });
    res.json(results);
  });
};
// ✅ Get only users with role 'user'
const getOnlyUsers = (req, res) => {
  const sql = "SELECT id, username, email, role, status, customer_id, created_at FROM users WHERE role = 'user'";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users" });
    res.json(results);
  });
};
// ✅ Weekly user registration count
const getWeeklyUserStats = (req, res) => {
  const sql = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count
    FROM users
    WHERE role = 'user'
      AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at)
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("User weekly stats error:", err);
      return res.status(500).json({ error: "Failed to fetch user stats" });
    }
    res.json(results); // returns [{ date: '2025-07-15', count: 4 }, ...]
  });
};



module.exports = {
  register,
  login,
  getUsers,
  getOnlyUsers,
  getWeeklyUserStats
};
