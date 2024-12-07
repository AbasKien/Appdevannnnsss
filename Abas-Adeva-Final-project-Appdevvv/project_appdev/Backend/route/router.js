// router.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/users/userController");
const productController = require("../controller/admin/productController");
const adminproductController = require("../controller/admin/adminproductController");
const orderController = require("../controller/users/orderController");
const adminOrderController = require("../controller/admin/adminorderController");
const cartController = require("../controller/users/cartController");
const upload = require("../config/upload"); 
const authenticate = require("../middleware/authenticate"); 
const isAdmin = require("../middleware/isAdmin");
const profileController = require("../controller/users/profileController");

// Define routes
router.get("/verify-email", userController.verifyEmail);
router.post("/register", userController.registrationHandler); 
router.post("/login", userController.loginHandler);

// Profile routes
router.get("/profile", authenticate, profileController.getProfile);
router.put("/profile", authenticate, profileController.updateProfile);

// Product routes
router.post("/add-product", upload.single("image"), productController.addProduct);
router.get("/products", productController.getAllProducts);
router.post("/admin/reduce-stock", productController.reduceStock);

// Cart routes
router.post('/cart/add', cartController.addToCart);
router.get('/cart', cartController.getCartItems);
router.put('/cart/update-quantity', cartController.updateCartQuantity);
router.delete('/cart/remove', cartController.removeFromCart);
router.delete('/cart/clear', cartController.clearCart);

// User Order routes
router.post("/orders", authenticate, orderController.placeOrder);
router.get("/orders", authenticate, orderController.getOrderHistory);
router.get("/orders/:orderId", authenticate, orderController.getOrderDetails);
router.post("/orders/:orderId/cancel", authenticate, orderController.cancelOrder);

// Admin check route
router.get("/admin/check", authenticate, isAdmin, (req, res) => {
  res.json({ success: true, isAdmin: true });
});

// Admin Order routes
router.get("/admin/orders", authenticate, isAdmin, adminOrderController.getAllOrders);
router.get("/admin/orders/:orderId", authenticate, isAdmin, adminOrderController.getOrderDetails);
router.put("/admin/orders/:orderId/status", authenticate, isAdmin, adminOrderController.updateOrderStatus);

// Admin Product routes
router.post("/adminproducts", adminproductController.addProduct);
router.patch("/products/:id/quantity", productController.updateProductQuantity);
router.put("/products/:id",
  authenticate,
  upload.single("image"),
  (req, res, next) => {
    if (req.file) {
      req.body.image_url = `/uploads/${req.file.filename}`;
    }
    next();
  },
  productController.updateProduct
);

// API endpoint to fetch data
router.get('/api/orders-summary', (req, res) => {
  const query = `
    SELECT 
      status, 
      COUNT(*) as count 
    FROM 
      orders 
    GROUP BY 
      status
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});


router.get("/products-with-logs", productController.getProductsWithLogs);

// Session check
router.get("/check-session", (req, res) => {
  if (req.session && req.session.userId) {
    res.json({
      isLoggedIn: true,
      userId: req.session.userId,
      role: req.session.role,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: "Failed to logout" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).send({ message: "Logged out successfully" });
  });
});

module.exports = router; // Export the router for use in app.js
