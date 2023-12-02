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
    const { products, sales_date, payment_method, total } = req.body;

    // Validate if the products array is not empty
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products array is empty or invalid",
      });
    }

    // Convert the products array to a JSON string
    const productsJSON = JSON.stringify(products);

    // Insert the sale into the sales table with discount_amt and discount_percentage
    const [result] = await pool.query(
      "INSERT INTO sales (products, sales_date, payment_method, total, discount_amt, discount_percentage) VALUES (?, ?, ?, ?, ?, ?)",
      [productsJSON, sales_date, payment_method, total, req.body.discount_amt, req.body.discount_percentage]
    );

    if (result.affectedRows === 1) {
      const sale_id = result.insertId;
      res.status(201).json({
        success: true,
        message: "Sale created successfully",
        sale_id,
      });
    } else {
      res.status(500).json({ success: false, message: "Failed to create sale" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Edit a sale
const editSale = asyncHandler(async (req, res) => {
  try {
    const sale_id = req.params.id;
    const { products, sales_date, payment_method, total } = req.body;

    // Validate if the products array is not empty
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products array is empty or invalid",
      });
    }

    // Validate if all products exist
    for (const { product_id } of products) {
      const [productRows] = await pool.query(
        "SELECT product_id FROM products WHERE product_id = ?",
        [product_id]
      );

      if (productRows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid product with ID ${product_id}`,
        });
      }
    }

    // Convert the products array to a JSON string
    const productsJSON = JSON.stringify(products);

    // Update the sale in the sales table with discount_amt and discount_percentage
    const [result] = await pool.query(
      "UPDATE sales SET products = ?, sales_date = ?, payment_method = ?, total = ?, discount_amt = ?, discount_percentage = ? WHERE sale_id = ?",
      [productsJSON, sales_date, payment_method, total, req.body.discount_amt, req.body.discount_percentage, sale_id]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Sale updated successfully" });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to update sale",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a sale
const deleteSale = asyncHandler(async (req, res) => {
  try {
    const sale_id = req.params.id;

    // Delete the sale from the sales table
    const [result] = await pool.query("DELETE FROM sales WHERE sale_id = ?", [
      sale_id,
    ]);

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Sale deleted successfully" });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to delete sale",
      });
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