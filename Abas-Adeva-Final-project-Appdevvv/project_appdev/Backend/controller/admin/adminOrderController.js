const orderModel = require('../../model/orderModel');

// Get all orders for admin
exports.getAllOrders = async (req, res) => {
    try {
        orderModel.getAllOrders((err, orders) => {
            if (err) {
                console.error('Error details:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error fetching orders',
                    error: err.message 
                });
            }
            res.json({ success: true, orders });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!['pending', 'ship', 'delivered', 'complete'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status',
                error: 'Status must be one of: pending, ship, delivered, complete'
            });
        }

        orderModel.updateOrderStatus(orderId, status, (err, result) => {
            if (err) {
                console.error('Error details:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error updating order status',
                    error: err.message
                });
            }
            res.json({ success: true, message: 'Order status updated successfully' });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        orderModel.getOrderDetails(orderId, (err, orderDetails) => {
            if (err) {
                console.error('Error details:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error fetching order details',
                    error: err.message
                });
            }
            res.json({ success: true, orderDetails });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: err.message
        });
    }
};
