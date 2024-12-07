const cartModel = require('../../model/cartModel');

// Get all cart items for a specific user
exports.getCartItems = (req, res) => {
    const userId = req.session.userId; // Assuming session contains userId
    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }

    cartModel.getAllByUser(userId)
        .then(items => {
            res.json({ success: true, items });
        })
        .catch(err => {
            console.error('Error in getCartItems:', err);
            res.status(500).json({ success: false, message: 'Error fetching cart items', error: err.message });
        });
};

// Add a product to the cart
exports.addToCart = (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }

    if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Quantity must be greater than zero' });
    }

    cartModel.addToCart(userId, productId, quantity)
        .then(() => {
            res.json({ success: true, message: 'Product added to cart successfully' });
        })
        .catch(err => {
            console.error('Error in addToCart:', err);
            res.status(500).json({ success: false, message: 'Error adding product to cart', error: err.message });
        });
};

// Update the quantity of a cart item
exports.updateCartQuantity = (req, res) => {
    const { cartId, quantity } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }

    if (!cartId) {
        return res.status(400).json({ success: false, message: 'Cart item ID is required' });
    }

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Quantity must be greater than zero' });
    }

    cartModel.updateQuantity(cartId, quantity)
        .then(() => {
            res.json({ success: true, message: 'Cart item quantity updated successfully' });
        })
        .catch(err => {
            console.error('Error in updateCartQuantity:', err);
            res.status(500).json({ success: false, message: 'Error updating cart quantity', error: err.message });
        });
};

// Remove a product from the cart
exports.removeFromCart = (req, res) => {
    const { cartId } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }

    if (!cartId) {
        return res.status(400).json({ success: false, message: 'Cart item ID is required' });
    }

    cartModel.removeFromCart(cartId)
        .then(() => {
            res.json({ success: true, message: 'Item removed from cart successfully' });
        })
        .catch(err => {
            console.error('Error in removeFromCart:', err);
            res.status(500).json({ success: false, message: 'Error removing item from cart', error: err.message });
        });
};

// Clear the entire cart
exports.clearCart = (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }

    cartModel.clearCart(userId)
        .then(() => {
            res.json({ success: true, message: 'Cart cleared successfully' });
        })
        .catch(err => {
            console.error('Error in clearCart:', err);
            res.status(500).json({ success: false, message: 'Error clearing cart', error: err.message });
        });
};
