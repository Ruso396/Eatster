const db = require('../config/db');

// Create User
const createUser = (user, callback) => {
  const query = `
    INSERT INTO users (username, email, password, customer_id, role, status) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [
    user.username, 
    user.email, 
    user.password, 
    user.customer_id, 
    user.role, 
    user.status
  ], callback);
};

// Find user by email (for login / check duplicates)
const findUserByEmail = (email, callback) => {
  db.query(`SELECT * FROM users WHERE email = ?`, [email], callback);
};

// Get all users
const getAllUsers = (callback) => {
  db.query(`SELECT id, username, email, role, status, customer_id FROM users`, callback);
};

module.exports = {
  createUser,
  findUserByEmail,
  getAllUsers
};
