const { createOrder, getOrderHistory, getOrderDetails, cancelOrder } = require('../../model/orderModel');
const { clearCart } = require('../../model/cartModel');

const orderController = {
  // Place a new order
  placeOrder: async (req, res) => {
    const { contact_number, address, payment_method, total_price, items } = req.body;
    const user_id = req.session.userId; // Get userId from session

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No items in order' 
      });
    }

    // Create the order in the database
    createOrder({ 
      user_id, 
      contact_number, 
      address, 
      payment_method, 
      total_price,
      items 
    }, async (err, orderId) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ 
          success: false,
          message: err.message || 'Failed to place order',
          error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
        });
      }

      try {
        // Clear the user's cart after successful order
        await clearCart(user_id);

        // Respond with success message
        return res.status(200).json({
          success: true,
          message: 'Order placed successfully!',
          orderId,
        });
      } catch (error) {
        console.error('Error clearing cart:', error);
        // Note: Order was still created successfully
        return res.status(200).json({
          success: true,
          message: 'Order placed successfully, but failed to clear cart',
          orderId,
        });
      }
    });
  },

  // Get order history for a user
  getOrderHistory: (req, res) => {
    const userId = req.session.userId;
    console.log('Getting order history for user:', userId);

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated'
      });
    }

    getOrderHistory(userId, (err, orders) => {
      if (err) {
        console.error('Error fetching order history:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to fetch order history',
          error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
        });
      }

      console.log(`Found ${orders?.length || 0} orders for user ${userId}`);
      
      return res.status(200).json({
        success: true,
        orders: orders || []
      });
    });
  },

  // Get specific order details
  getOrderDetails: (req, res) => {
    const orderId = req.params.orderId;
    const userId = req.session.userId;

    getOrderDetails(orderId, (err, order) => {
      if (err) {
        console.error('Error fetching order details:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to fetch order details',
          error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
        });
      }

      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: 'Order not found' 
        });
      }

      // Ensure user can only access their own orders
      if (order.user_id !== userId) {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied' 
        });
      }

      return res.status(200).json({
        success: true,
        order
      });
    });
  },

  // Cancel an order
  cancelOrder: async (req, res) => {
    const orderId = req.params.orderId;
    const userId = req.session.userId;

    try {
      const result = await cancelOrder(orderId, userId);
      if (result.success) {
        res.status(200).json({ 
          success: true,
          message: 'Order cancelled successfully' 
        });
      } else {
        res.status(400).json({ 
          success: false,
          message: result.message || 'Failed to cancel order' 
        });
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to cancel order',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      });
    }
  }
};

module.exports = orderController;
