const db = require('../config/db');

const profileModel = {
    // Get user profile with user details
    getByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT p.fullname, p.email, p.phone, p.address
                FROM profiles p
                WHERE p.user_id = ?
            `;
            db.query(query, [userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0] || null);
            });
        });
    },

    // Create initial profile after registration
    createInitialProfile: (userId, userData) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO profiles (user_id, fullname, email) VALUES (?, ?, ?)";
            db.query(query, [userId, userData.fullname, userData.email], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    // Update profile information
    updateProfile: (userId, profileData) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE profiles SET phone = ?, address = ? WHERE user_id = ?";
            db.query(query, [profileData.phone, profileData.address, userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
};

module.exports = profileModel;
