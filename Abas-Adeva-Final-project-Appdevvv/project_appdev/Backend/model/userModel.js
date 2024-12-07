const pool = require('../config/db'); // Import the database pool

// Find a user by email
const findByEmail = (email, callback) => {
  pool.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Find a user by verification token
const findByVerificationToken = (token, callback) => {
  pool.query('SELECT * FROM users WHERE verification_token = ?', [token], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};

// Create a new user
const create = (userData, callback) => {
  const { fullname, email, password, verification_token } = userData;
  pool.query(
    'INSERT INTO users (fullname, email, password, verification_token, is_verified) VALUES (?, ?, ?, ?, ?)',
    [fullname, email, password, verification_token, false], // Default: not verified
    (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    }
  );
};

// Update verification status
const updateVerificationStatus = (userId, callback) => {
  pool.query(
    'UPDATE users SET is_verified = ? WHERE id = ?',
    [true, userId],
    (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    }
  );
};

// Find a user by ID
const findById = (userId, callback) => {
  pool.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};

module.exports = {
  findByEmail,
  findByVerificationToken,
  create,
  updateVerificationStatus,
  findById,
};
