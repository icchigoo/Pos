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

// Create an opening stock entry
const createOpeningStock = asyncHandler(async (req, res) => {
  try {
    const { opening_qty, opening_purchase_rate, opening_sale_rate, product_id } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user has permission to create an opening stock entry for the product
    const [productRows] = await pool.query(
      "SELECT p.product_id FROM products p JOIN categories c ON p.category_id = c.category_id JOIN groups g ON c.group_id = g.group_id WHERE p.product_id = ? AND g.user_id = ?",
      [product_id, user_id]
    );

    if (productRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to create an opening stock entry for this product",
      });
    } else {
      // Insert the opening stock entry into the opening_stock table
      const [result] = await pool.query(
        "INSERT INTO opening_stock (opening_qty, opening_purchase_rate, opening_sale_rate, product_id) VALUES (?, ?, ?, ?)",
        [opening_qty, opening_purchase_rate, opening_sale_rate, product_id]
      );

      if (result.affectedRows === 1) {
        const opening_stock_id = result.insertId;
        res.status(201).json({
          success: true,
          message: "Opening stock entry created successfully",
          opening_stock_id,
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to create opening stock entry" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete an opening stock entry
const deleteOpeningStock = asyncHandler(async (req, res) => {
  try {
    const opening_stock_id = req.params.id; // Extract opening_stock_id from URL parameter
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user has permission to delete the opening stock entry
    const [openingStockRows] = await pool.query(
      "SELECT os.opening_stock_id FROM opening_stock os JOIN products p ON os.product_id = p.product_id JOIN categories c ON p.category_id = c.category_id JOIN groups g ON c.group_id = g.group_id WHERE os.opening_stock_id = ? AND g.user_id = ?",
      [opening_stock_id, user_id]
    );

    if (openingStockRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this opening stock entry",
      });
    } else {
      // Delete the opening stock entry from the opening_stock table
      const [result] = await pool.query(
        "DELETE FROM opening_stock WHERE opening_stock_id = ?",
        [opening_stock_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Opening stock entry deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Opening stock entry not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit an opening stock entry
const editOpeningStock = asyncHandler(async (req, res) => {
  try {
    const opening_stock_id = req.params.id; // Extract opening_stock_id from URL parameter
    const { opening_qty, opening_purchase_rate, opening_sale_rate, product_id } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user has permission to edit the opening stock entry
    const [openingStockRows] = await pool.query(
      "SELECT os.opening_stock_id FROM opening_stock os JOIN products p ON os.product_id = p.product_id JOIN categories c ON p.category_id = c.category_id JOIN groups g ON c.group_id = g.group_id WHERE os.opening_stock_id = ? AND g.user_id = ?",
      [opening_stock_id, user_id]
    );

    if (openingStockRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to edit this opening stock entry",
      });
    } else {
      // Update the opening stock entry in the opening_stock table
      const [result] = await pool.query(
        "UPDATE opening_stock SET opening_qty = ?, opening_purchase_rate = ?, opening_sale_rate = ?, product_id = ? WHERE opening_stock_id = ?",
        [opening_qty, opening_purchase_rate, opening_sale_rate, product_id, opening_stock_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Opening stock entry updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Opening stock entry not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all opening stock entries
const fetchAllOpeningStock = asyncHandler(async (req, res) => {
  try {
    // Fetch all opening stock entries associated with the authenticated user's products
    const [openingStockRows] = await pool.query(
      "SELECT os.* FROM opening_stock os JOIN products p ON os.product_id = p.product_id JOIN categories c ON p.category_id = c.category_id JOIN groups g ON c.group_id = g.group_id WHERE g.user_id = ?",
      [req.user.id]
    );

    res.json({ success: true, opening_stock_entries: openingStockRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createOpeningStock,
  deleteOpeningStock,
  editOpeningStock,
  fetchAllOpeningStock,
};
