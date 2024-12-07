const db = require('../config/db');

const cartModel = {
    // Get all cart items for a specific user
    getAllByUser: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.id as cart_id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
                FROM cart c
                JOIN products p ON c.productId = p.id
                WHERE c.userId = ?
            `;
            db.query(query, [userId], (err, results) => {
                if (err) {
                    console.error('Error fetching cart items:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    // Add item to cart
    addToCart: (userId, productId, quantity) => {
        return new Promise((resolve, reject) => {
            // First check if the product exists in the cart
            const checkQuery = "SELECT id, quantity FROM cart WHERE userId = ? AND productId = ?";
            db.query(checkQuery, [userId, productId], (err, results) => {
                if (err) {
                    console.error('Error checking cart:', err);
                    return reject(err);
                }

                if (results.length > 0) {
                    // Product exists, update quantity
                    const newQuantity = results[0].quantity + quantity;
                    const updateQuery = "UPDATE cart SET quantity = ? WHERE id = ?";
                    db.query(updateQuery, [newQuantity, results[0].id], (err, result) => {
                        if (err) {
                            console.error('Error updating cart quantity:', err);
                            return reject(err);
                        }
                        resolve(result);
                    });
                } else {
                    // Product doesn't exist, insert new item
                    const insertQuery = "INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)";
                    db.query(insertQuery, [userId, productId, quantity], (err, result) => {
                        if (err) {
                            console.error('Error adding to cart:', err);
                            return reject(err);
                        }
                        resolve(result);
                    });
                }
            });
        });
    },

    // Update cart item quantity
    updateQuantity: (cartId, quantity) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE cart SET quantity = ? WHERE id = ?";
            db.query(query, [quantity, cartId], (err, result) => {
                if (err) {
                    console.error('Error updating cart quantity:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    // Remove item from cart
    removeFromCart: (cartId) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM cart WHERE id = ?";
            db.query(query, [cartId], (err, result) => {
                if (err) {
                    console.error('Error removing item from cart:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    // Clear cart for a user
    clearCart: (userId) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM cart WHERE userId = ?";
            db.query(query, [userId], (err, result) => {
                if (err) {
                    console.error('Error clearing cart:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
};

module.exports = cartModel;
