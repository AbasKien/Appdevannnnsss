const db = require('../config/db');

// Function to create an order in the database
const createOrder = (orderData, callback) => {
  const { user_id, contact_number, address, payment_method, total_price, items } = orderData;

  // Start a transaction
  db.getConnection((err, connection) => {
    if (err) {
      return callback(err, null);
    }

    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        return callback(err, null);
      }

      // Insert the order
      const orderQuery = `
        INSERT INTO orders (user_id, contact_number, address, payment_method, total_price, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', NOW())
      `;
      const orderValues = [user_id, contact_number, address, payment_method, total_price];

      connection.query(orderQuery, orderValues, (err, orderResult) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            callback(err, null);
          });
        }

        const orderId = orderResult.insertId;

        // Insert order items
        const itemsQuery = `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ?
        `;
        const itemsValues = items.map(item => [
          orderId,
          item.product_id,
          item.quantity,
          item.price
        ]);

        connection.query(itemsQuery, [itemsValues], (err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              callback(err, null);
            });
          }

          // Update product stock
          const updateStockPromises = items.map(item => {
            return new Promise((resolve, reject) => {
              const updateStockQuery = `
                UPDATE products 
                SET stock = stock - ? 
                WHERE id = ? AND stock >= ?
              `;
              connection.query(updateStockQuery, [item.quantity, item.product_id, item.quantity], (err, result) => {
                if (err) reject(err);
                else if (result.affectedRows === 0) {
                  reject(new Error(`Insufficient stock for product ID ${item.product_id}`));
                }
                else resolve();
              });
            });
          });

          Promise.all(updateStockPromises)
            .then(() => {
              // Commit transaction
              connection.commit(err => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    callback(err, null);
                  });
                }
                connection.release();
                callback(null, orderId);
              });
            })
            .catch(err => {
              connection.rollback(() => {
                connection.release();
                callback(err, null);
              });
            });
        });
      });
    });
  });
};

// Function to get order history for a user
const getOrderHistory = (userId, callback) => {
  console.log('Getting order history for user:', userId);
  
  const query = `
    SELECT 
      o.id,
      o.user_id,
      o.total_price,
      o.status,
      o.created_at,
      o.contact_number,
      o.address,
      o.payment_method,
      JSON_ARRAYAGG(
        IF(oi.id IS NOT NULL,
          JSON_OBJECT(
            'id', oi.id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'name', p.name
          ),
          NULL
        )
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id, o.user_id, o.total_price, o.status, o.created_at, o.contact_number, o.address, o.payment_method
    ORDER BY o.created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return callback(err);
    }

    try {
      // Process the results to handle the items array
      const orders = results.map(order => ({
        ...order,
        items: Array.isArray(order.items) ? 
          order.items.filter(item => item !== null) : []
      }));

      console.log('Found orders:', orders);
      callback(null, orders);
    } catch (error) {
      console.error('Error processing orders:', error);
      callback(error);
    }
  });
};

// Function to get order details
const getOrderDetails = (orderId, callback) => {
  const query = `
    SELECT 
      o.id as order_id,
      o.user_id,
      o.contact_number,
      o.address,
      o.payment_method,
      o.total_price,
      o.status,
      o.created_at,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name,
          'product_image', p.image_url
        )
      ) as items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.id = ?
    GROUP BY o.id
  `;

  db.query(query, [orderId], callback);
};

// Function to cancel an order
const cancelOrder = (orderId, userId) => {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.beginTransaction(async (err) => {
        if (err) {
          connection.release();
          reject(err);
          return;
        }

        try {
          // First check if order exists and belongs to user
          const [order] = await connection.promise().query(
            'SELECT status FROM orders WHERE id = ? AND user_id = ?',
            [orderId, userId]
          );

          if (!order.length) {
            throw new Error('Order not found');
          }

          if (order[0].status !== 'pending') {
            throw new Error('Only pending orders can be cancelled');
          }

          // Update order status to cancelled
          await connection.promise().query(
            'UPDATE orders SET status = "cancelled" WHERE id = ?',
            [orderId]
          );

          // Get order items to restore stock
          const [items] = await connection.promise().query(
            'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
            [orderId]
          );

          // Restore stock for each item
          for (const item of items) {
            await connection.promise().query(
              'UPDATE products SET stock = stock + ? WHERE id = ?',
              [item.quantity, item.product_id]
            );
          }

          await connection.promise().commit();
          connection.release();
          resolve({ success: true });

        } catch (error) {
          await connection.promise().rollback();
          connection.release();
          resolve({ success: false, message: error.message });
        }
      });
    });
  });
};

// Function to get all orders (for admin)
const getAllOrders = (callback) => {
  const query = `
    SELECT o.id, o.user_id, o.contact_number, o.address, 
           o.payment_method, o.total_price, o.status, o.created_at,
           u.fullname
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Function to update order status
const updateOrderStatus = (orderId, status, callback) => {
  // Validate status against ENUM values
  const query = `
    UPDATE orders 
    SET status = ?
    WHERE id = ? AND status != 'complete'
  `;
  
  db.query(query, [status, orderId], (err, result) => {
    if (err) {
      console.error('Error updating status:', err);
      return callback(err, null);
    }
    if (result.affectedRows === 0) {
      return callback(new Error('Order not found or already completed'), null);
    }
    callback(null, result);
  });
};

module.exports = { 
  createOrder,
  getOrderHistory,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};
