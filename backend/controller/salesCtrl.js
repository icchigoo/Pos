const mysql = require("mysql2/promise");
const asyncHandler = require("express-async-handler");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create a sale
const createSale = asyncHandler(async (req, res) => {
  try {
    const {
      product_id,
      qty,
      tax_id,
      discount_amt,
      discount_percentage,
      total,
      customer_id,
      sales_date,
      payment_method,
    } = req.body;

    // Check if the product, tax, and customer exist (you can add more checks as needed)
    const [productRows] = await pool.query(
      "SELECT product_id FROM products WHERE product_id = ?",
      [product_id]
    );

    const [taxRows] = await pool.query(
      "SELECT tax_id FROM taxes WHERE tax_id = ?",
      [tax_id]
    );

    const [customerRows] = await pool.query(
      "SELECT customer_id FROM customers WHERE customer_id = ?",
      [customer_id]
    );

    if (
      productRows.length === 0 ||
      taxRows.length === 0 ||
      customerRows.length === 0
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid product, tax, or customer",
      });
    } else {
      // Insert the sale into the sales table
      const [result] = await pool.query(
        "INSERT INTO sales (product_id, qty, tax_id, discount_amt, discount_percentage, total, customer_id, sales_date, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          product_id,
          qty,
          tax_id,
          discount_amt,
          discount_percentage,
          total,
          customer_id,
          sales_date,
          payment_method,
        ]
      );

      if (result.affectedRows === 1) {
        const sale_id = result.insertId;
        res.status(201).json({
          success: true,
          message: "Sale created successfully",
          sale_id,
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to create sale" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a sale
const deleteSale = asyncHandler(async (req, res) => {
  try {
    const sale_id = req.params.id;

    // Check if the sale exists
    const [saleRows] = await pool.query(
      "SELECT sale_id FROM sales WHERE sale_id = ?",
      [sale_id]
    );

    if (saleRows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    } else {
      // Delete the sale from the sales table
      const [result] = await pool.query(
        "DELETE FROM sales WHERE sale_id = ?",
        [sale_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Sale deleted successfully" });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to delete sale",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit a sale
const editSale = asyncHandler(async (req, res) => {
  try {
    const sale_id = req.params.id;
    const {
      product_id,
      qty,
      tax_id,
      discount_amt,
      discount_percentage,
      total,
      customer_id,
      sales_date,
      payment_method,
    } = req.body;

    // Check if the sale exists
    const [saleRows] = await pool.query(
      "SELECT sale_id FROM sales WHERE sale_id = ?",
      [sale_id]
    );

    if (saleRows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    } else {
      // Update the sale in the sales table
      const [result] = await pool.query(
        "UPDATE sales SET product_id = ?, qty = ?, tax_id = ?, discount_amt = ?, discount_percentage = ?, total = ?, customer_id = ?, sales_date = ?, payment_method = ? WHERE sale_id = ?",
        [
          product_id,
          qty,
          tax_id,
          discount_amt,
          discount_percentage,
          total,
          customer_id,
          sales_date,
          payment_method,
          sale_id,
        ]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Sale updated successfully" });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update sale",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all sales
const fetchAllSales = asyncHandler(async (req, res) => {
  try {
    // Fetch all sales
    const [salesRows] = await pool.query("SELECT * FROM sales");

    res.json({ success: true, sales: salesRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createSale,
  deleteSale,
  editSale,
  fetchAllSales,
};
