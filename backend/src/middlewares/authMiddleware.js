const jwt = require('jsonwebtoken');
const db = require('../config/db');

// ✅ Middleware to protect any route with token
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    // ✅ Ensure this query returns role + restaurant_id
    const query = 'SELECT id, username, email, role, restaurant_id FROM users WHERE id = ?';

    db.query(query, [decoded.id], (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ message: 'User not found or unauthorized' });
      }

      req.user = results[0]; // ✅ Now contains req.user.role and req.user.restaurant_id
      next();
    });
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Admin or Superadmin only
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  return res.status(403).json({ message: 'Not authorized as admin' });
};

module.exports = { protect, adminOnly };





// const jwt = require('jsonwebtoken');
// const db = require('../config/db');

// // ✅ Protect middleware - for any logged-in user
// const protect = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

//     const query = 'SELECT id, username, email, role, restaurant_id FROM users WHERE id = ?';
//     db.query(query, [decoded.id], (err, users) => {
//       if (err || users.length === 0) {
//         return res.status(401).json({ message: 'Not authorized, user not found' });
//       }

//       req.user = users[0]; // Attach user object
//       next();
//     });
//   } catch (err) {
//     console.error('Token verification failed:', err);
//     return res.status(401).json({ message: 'Not authorized, token invalid' });
//   }
// };

// // ✅ Only allow Admins and Superadmins
// const adminOnly = (req, res, next) => {
//   if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
//     return next();
//   }
//   return res.status(403).json({ message: 'Not authorized as an admin' });
// };

// module.exports = { protect, adminOnly };










// const jwt = require('jsonwebtoken');
// const db = require('../config/db');

// // Protect routes (any logged-in user)
// const protect = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

//     // Fetch user from DB using decoded id
//     const query = 'SELECT id, username, email, role, restaurant_id FROM users WHERE id = ?';
//     db.query(query, [decoded.id], (err, users) => {
//       if (err || users.length === 0) {
//         return res.status(401).json({ message: 'Not authorized, user not found' });
//       }

//       req.user = users[0]; // Attach full user to req
//       next();
//     });
//   } catch (err) {
//     console.error('Token verification failed:', err);
//     return res.status(401).json({ message: 'Not authorized, token invalid' });
//   }
// };

// // Restrict to admins & superadmins
// const adminOnly = (req, res, next) => {
//   if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
//     return next();
//   }
//   return res.status(403).json({ message: 'Not authorized as an admin' });
// };

// module.exports = { protect, adminOnly };
















// // const jwt = require('jsonwebtoken');
// // const db = require('../config/db');

// // const protect = (req, res, next) => {
// //   let token;

// //   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
// //     try {
// //       // Get token from header
// //       token = req.headers.authorization.split(' ')[1];

// //       // Verify token
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

// //       // Get user from the token
// //       const query = 'SELECT id, username, email, role, restaurant_id FROM users WHERE id = ?';
// //       db.query(query, [decoded.id], (err, users) => {
// //         if (err || users.length === 0) {
// //           return res.status(401).json({ message: 'Not authorized, user not found' });
// //         }
        
// //         // Attach user to the request object
// //         req.user = users[0];
// //         next();
// //       });
// //     } catch (error) {
// //       console.error(error);
// //       res.status(401).json({ message: 'Not authorized, token failed' });
// //     }
// //   }

// //   if (!token) {
// //     res.status(401).json({ message: 'Not authorized, no token' });
// //   }
// // };

// // const adminOnly = (req, res, next) => {
// //     if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
// //         next();
// //     } else {
// //         res.status(403).json({ message: 'Not authorized as an admin' });
// //     }
// // };

// // module.exports = { protect, adminOnly };


