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
      const customer_id = result.insertId;
      res.status(201).json({
        success: true,
        message: "Customer created successfully",
        customer_id,
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
    const customer_id = req.params.id;
    const user_id = req.user.id;

    const [customerRows] = await pool.query(
      "SELECT * FROM customers WHERE customer_id = ? AND user_id = ?",
      [customer_id, user_id]
    );

    if (customerRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this customer",
      });
    } else {
      const [result] = await pool.query(
        "DELETE FROM customers WHERE customer_id = ?",
        [customer_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Customer deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Customer not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const editCustomer = asyncHandler(async (req, res) => {
  try {
    const customer_id = req.params.id;
    const { first_name, last_name, email, phone, address, membership_id } = req.body;
    const user_id = req.user.id;

    const [customerRows] = await pool.query(
      "SELECT * FROM customers WHERE customer_id = ? AND user_id = ?",
      [customer_id, user_id]
    );

    if (customerRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to edit this customer",
      });
    } else {
      const [result] = await pool.query(
        "UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, membership_id = ? WHERE customer_id = ?",
        [first_name, last_name, email, phone, address, membership_id, customer_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Customer updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Customer not found" });
      }
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
