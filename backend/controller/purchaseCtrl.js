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

// Create a purchase
const createPurchase = asyncHandler(async (req, res) => {
  try {
    const {
      product_id,
      supplier_id,
      bill_no,
      bill_date,
      entry_date,
      qty,
      purchase_rate,
      discount_rate,
      discount,
      total,
      vat,
      grand_total,
    } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user has permission to create a purchase
    // You can add your authorization logic here

    // Insert the purchase into the purchase table
    const [result] = await pool.query(
      "INSERT INTO purchase (product_id, supplier_id, bill_no, bill_date, entry_date, qty, purchase_rate, discount_rate, discount, total, vat, grand_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        product_id,
        supplier_id,
        bill_no,
        bill_date,
        entry_date,
        qty,
        purchase_rate,
        discount_rate,
        discount,
        total,
        vat,
        grand_total,
      ]
    );

    if (result.affectedRows === 1) {
      const purchase_id = result.insertId;
      res.status(201).json({
        success: true,
        message: "Purchase created successfully",
        purchase_id,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to create purchase" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a purchase
const deletePurchase = asyncHandler(async (req, res) => {
  try {
    const purchase_id = req.params.id; // Extract purchase_id from URL parameter
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user has permission to delete the purchase
    // You can add your authorization logic here

    // Delete the purchase from the purchase table
    const [result] = await pool.query(
      "DELETE FROM purchase WHERE purchase_id = ?",
      [purchase_id]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Purchase deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Purchase not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit a purchase
const editPurchase = asyncHandler(async (req, res) => {
  try {
    const purchase_id = req.params.id; // Extract purchase_id from URL parameter
    const {
      product_id,
      supplier_id,
      bill_no,
      bill_date,
      entry_date,
      qty,
      purchase_rate,
      discount_rate,
      discount,
      total,
      vat,
      grand_total,
    } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user has permission to edit the purchase
    // You can add your authorization logic here

    // Update the purchase in the purchase table
    const [result] = await pool.query(
      "UPDATE purchase SET product_id = ?, supplier_id = ?, bill_no = ?, bill_date = ?, entry_date = ?, qty = ?, purchase_rate = ?, discount_rate = ?, discount = ?, total = ?, vat = ?, grand_total = ? WHERE purchase_id = ?",
      [
        product_id,
        supplier_id,
        bill_no,
        bill_date,
        entry_date,
        qty,
        purchase_rate,
        discount_rate,
        discount,
        total,
        vat,
        grand_total,
        purchase_id,
      ]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Purchase updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Purchase not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all purchases
const fetchAllPurchases = asyncHandler(async (req, res) => {
  try {
    // Fetch all purchases
    const [purchaseRows] = await pool.query("SELECT * FROM purchase");

    res.json({ success: true, purchases: purchaseRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createPurchase,
  deletePurchase,
  editPurchase,
  fetchAllPurchases,
};
