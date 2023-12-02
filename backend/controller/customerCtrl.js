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

const createCustomer = asyncHandler(async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address, membership_id } = req.body;
    const user_id = req.user.id;

    const [result] = await pool.query(
      "INSERT INTO customers (first_name, last_name, email, phone, address, membership_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, phone, address, membership_id, user_id]
    );

    if (result.affectedRows === 1) {
      res.status(201).json({
        success: true,
        message: "Customer created successfully",
      });
    } else {
      res.status(500).json({ success: false, message: "Failed to create customer" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const deleteCustomer = asyncHandler(async (req, res) => {
  try {
    const user_id = req.user.id;

    // Assuming customer_id is provided in the request body or query parameters
    const customer_id = req.body.customer_id || req.query.customer_id;

    const [result] = await pool.query(
      "DELETE FROM customers WHERE customer_id = ? AND user_id = ?",
      [customer_id, user_id]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Customer deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const editCustomer = asyncHandler(async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address, membership_id } = req.body;
    const user_id = req.user.id;

    // Assuming customer_id is provided in the request body or query parameters
    const customer_id = req.body.customer_id || req.query.customer_id;

    const [result] = await pool.query(
      "UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, membership_id = ? WHERE customer_id = ? AND user_id = ?",
      [first_name, last_name, email, phone, address, membership_id, customer_id, user_id]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Customer updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const fetchAllCustomers = asyncHandler(async (req, res) => {
  try {
    const [customerRows] = await pool.query(
      "SELECT * FROM customers WHERE user_id = ?",
      [req.user.id]
    );

    res.json({ success: true, customers: customerRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createCustomer,
  deleteCustomer,
  editCustomer,
  fetchAllCustomers,
};
