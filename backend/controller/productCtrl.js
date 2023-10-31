const mysql = require("mysql2/promise");
const asyncHandler = require("express-async-handler");

// Establish a MySQL connection pool (similar to what you've done before)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create a product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { product_name, product_desc, status, category_id, unit_id } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user is the creator of the group associated with the category
    const [categoryRows] = await pool.query(
      "SELECT c.category_id FROM categories c JOIN groups g ON c.group_id = g.group_id WHERE c.category_id = ? AND g.user_id = ?",
      [category_id, user_id]
    );

    if (categoryRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to create a product for this category",
      });
    } else {
      // Insert the product into the products table and associate it with the category and unit
      const [result] = await pool.query(
        "INSERT INTO products (product_name, product_desc, status, category_id, unit_id) VALUES (?, ?, ?, ?, ?)",
        [product_name, product_desc, status, category_id, unit_id]
      );

      if (result.affectedRows === 1) {
        const product_id = result.insertId;
        res.status(201).json({
          success: true,
          message: "Product created successfully",
          product_id,
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to create product" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product_id = req.params.id; // Extract product_id from URL parameter
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user is the creator of the category associated with the product
    const [productRows] = await pool.query(
      "SELECT p.product_id FROM products p JOIN categories c ON p.category_id = c.category_id JOIN groups g ON c.group_id = g.group_id WHERE p.product_id = ? AND g.user_id = ?",
      [product_id, user_id]
    );

    if (productRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this product",
      });
    } else {
      // Delete the product from the products table
      const [result] = await pool.query(
        "DELETE FROM products WHERE product_id = ?",
        [product_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Product deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Product not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit a product
const editProduct = asyncHandler(async (req, res) => {
  try {
    const product_id = req.params.id; // Extract product_id from URL parameter
    const { product_name, product_desc, status, category_id, unit_id } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user is the creator of the category associated with the product
    const [productRows] = await pool.query(
      "SELECT p.product_id FROM products p JOIN categories c ON p.category_id = c.category_id JOIN groups g ON c.group_id = g.group_id WHERE p.product_id = ? AND g.user_id = ?",
      [product_id, user_id]
    );

    if (productRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to edit this product",
      });
    } else {
      // Update the product in the products table, including the 'status' field
      const [result] = await pool.query(
        "UPDATE products SET product_name = ?, product_desc = ?, status = ?, category_id = ?, unit_id = ? WHERE product_id = ?",
        [product_name, product_desc, status, category_id, unit_id, product_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Product updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Product not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all products
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    // Fetch all products associated with the authenticated user's categories
    const [productsRows] = await pool.query(
      "SELECT p.* FROM products p JOIN categories c ON p.category_id = c.category_id JOIN groups g ON c.group_id = g.group_id WHERE g.user_id = ?",
      [req.user.id]
    );

    res.json({ success: true, products: productsRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
};
