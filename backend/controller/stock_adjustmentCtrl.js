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

// Create a stock adjustment
const createStockAdjustment = asyncHandler(async (req, res) => {
  try {
    const { adjustment_title, adjustment_qty, adjustment_type, reason, product_id } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user is authorized to perform the adjustment
    const [productRows] = await pool.query(
      "SELECT p.product_id FROM products p JOIN categories c ON p.category_id = c.category_id JOIN groups g ON c.group_id = g.group_id WHERE p.product_id = ? AND g.user_id = ?",
      [product_id, user_id]
    );

    if (productRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to create a stock adjustment for this product",
      });
    } else {
      // Insert the stock adjustment into the stock_adjustment table and associate it with the product
      const [result] = await pool.query(
        "INSERT INTO stock_adjustment (adjustment_title, adjustment_qty, adjustment_type, reason, product_id) VALUES (?, ?, ?, ?, ?)",
        [adjustment_title, adjustment_qty, adjustment_type, reason, product_id]
      );

      if (result.affectedRows === 1) {
        const stock_adj_id = result.insertId;
        res.status(201).json({
          success: true,
          message: "Stock adjustment created successfully",
          stock_adj_id,
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to create stock adjustment" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a stock adjustment
const deleteStockAdjustment = asyncHandler(async (req, res) => {
  try {
    const stock_adj_id = req.params.id; // Extract stock_adj_id from URL parameter
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user is authorized to delete the stock adjustment
    const [stockAdjRows] = await pool.query(
      "SELECT s.stock_adj_id FROM stock_adjustment s JOIN products p ON s.product_id = p.product_id JOIN categories c ON p.category_id = c.category_id JOIN groups g ON c.group_id = g.group_id WHERE s.stock_adj_id = ? AND g.user_id = ?",
      [stock_adj_id, user_id]
    );

    if (stockAdjRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this stock adjustment",
      });
    } else {
      // Delete the stock adjustment from the stock_adjustment table
      const [result] = await pool.query(
        "DELETE FROM stock_adjustment WHERE stock_adj_id = ?",
        [stock_adj_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Stock adjustment deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Stock adjustment not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit a stock adjustment
const editStockAdjustment = asyncHandler(async (req, res) => {
  try {
    const stock_adj_id = req.params.id; // Extract stock_adj_id from URL parameter
    const { adjustment_title, adjustment_qty, adjustment_type, reason, product_id } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user is authorized to edit the stock adjustment
    const [stockAdjRows] = await pool.query(
      "SELECT s.stock_adj_id FROM stock_adjustment s JOIN products p ON s.product_id = p.product_id JOIN categories c ON p.category_id = c.category_id JOIN groups g ON c.group_id = g.group_id WHERE s.stock_adj_id = ? AND g.user_id = ?",
      [stock_adj_id, user_id]
    );

    if (stockAdjRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to edit this stock adjustment",
      });
    } else {
      // Update the stock adjustment in the stock_adjustment table
      const [result] = await pool.query(
        "UPDATE stock_adjustment SET adjustment_title = ?, adjustment_qty = ?, adjustment_type = ?, reason = ?, product_id = ? WHERE stock_adj_id = ?",
        [adjustment_title, adjustment_qty, adjustment_type, reason, product_id, stock_adj_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Stock adjustment updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Stock adjustment not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all stock adjustments
const fetchAllStockAdjustments = asyncHandler(async (req, res) => {
  try {
    // Fetch all stock adjustments associated with the authenticated user's products
    const [stockAdjRows] = await pool.query(
      "SELECT s.* FROM stock_adjustment s JOIN products p ON s.product_id = p.product_id JOIN categories c ON p.category_id = c.category_id JOIN groups g ON c.group_id = g.group_id WHERE g.user_id = ?",
      [req.user.id]
    );

    res.json({ success: true, stock_adjustments: stockAdjRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createStockAdjustment,
  deleteStockAdjustment,
  editStockAdjustment,
  fetchAllStockAdjustments,
};
