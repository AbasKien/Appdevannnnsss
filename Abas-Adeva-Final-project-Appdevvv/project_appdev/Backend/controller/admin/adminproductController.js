const adminModel = require('../../model/adminModel');
const userModel = require('../../model/userModel'); // Assuming you have a model for user products

// Add Product for both Users and Admins
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    // Ensure the image file is uploaded
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image_url) {
      return res.status(400).json({ success: false, message: 'Image file is required!' });
    }

    // Data object for the product
    const newProduct = { name, description, price, stock, image_url };

    // Insert into users' products database
    await userModel.create(newProduct);

    // Insert into admin products database
    await adminModel.create(newProduct);

    res.json({ success: true, message: 'Product added successfully!' });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ success: false, message: 'Error adding product', error: err });
  }
};

// Get all products (admin view)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await adminModel.findAll();
    res.json({ success: true, products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Error fetching products', error: err });
  }
};
