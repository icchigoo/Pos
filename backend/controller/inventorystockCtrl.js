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

// Create an inventory stock
const createInventoryStock = asyncHandler(async (req, res) => {
  try {
    const {
      product_id,
      stock_qty,
      purchase_rate,
      total_purchased_balance,
      stock_adj_id,
      sales_id,
      total_stock_qty,
      total_stock_balance,
    } = req.body;

    // Insert the inventory stock record into the inventory_stock table
    const [result] = await pool.query(
      "INSERT INTO inventory_stock (product_id, stock_qty, purchase_rate, total_purchased_balance, stock_adj_id, sales_id, total_stock_qty, total_stock_balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        product_id,
        stock_qty,
        purchase_rate,
        total_purchased_balance,
        stock_adj_id,
        sales_id,
        total_stock_qty,
        total_stock_balance,
      ]
    );

    if (result.affectedRows === 1) {
      const stock_id = result.insertId;
      res.status(201).json({
        success: true,
        message: "Inventory stock created successfully",
        stock_id,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to create inventory stock" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete an inventory stock
const deleteInventoryStock = asyncHandler(async (req, res) => {
  try {
    const stock_id = req.params.id; // Extract stock_id from URL parameter

    // Delete the inventory stock record from the inventory_stock table
    const [result] = await pool.query(
      "DELETE FROM inventory_stock WHERE stock_id = ?",
      [stock_id]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Inventory stock deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Inventory stock not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit an inventory stock
const editInventoryStock = asyncHandler(async (req, res) => {
  try {
    const stock_id = req.params.id; // Extract stock_id from URL parameter
    const {
      stock_qty,
      purchase_rate,
      total_purchased_balance,
      stock_adjustment_id,
      sales_id,
      total_stock_qty,
      total_stock_balance,
    } = req.body;

    // Update the inventory stock record in the inventory_stock table
    const [result] = await pool.query(
      "UPDATE inventory_stock SET stock_qty = ?, purchase_rate = ?, total_purchased_balance = ?, stock_adjustment_id = ?, sales_id = ?, total_stock_qty = ?, total_stock_balance = ? WHERE stock_id = ?",
      [
        stock_qty,
        purchase_rate,
        total_purchased_balance,
        stock_adjustment_id,
        sales_id,
        total_stock_qty,
        total_stock_balance,
        stock_id,
      ]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Inventory stock updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Inventory stock not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all inventory stocks
const fetchAllInventoryStocks = asyncHandler(async (req, res) => {
  try {
    // Fetch all inventory stocks from the inventory_stock table
    const [inventoryStocksRows] = await pool.query("SELECT * FROM inventory_stock");

    res.json({ success: true, inventoryStocks: inventoryStocksRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createInventoryStock,
  deleteInventoryStock,
  editInventoryStock,
  fetchAllInventoryStocks,
};
