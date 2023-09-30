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

// Create a supplier
const createSupplier = asyncHandler(async (req, res) => {
  try {
    const {
      supplier_name,
      address,
      PAN_No,
      contact_number,
      contact_person,
      status,
    } = req.body;
    const user_id = req.user.id;

    const [result] = await pool.query(
      "INSERT INTO suppliers (supplier_name, address, PAN_No, contact_number, contact_person, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        supplier_name,
        address,
        PAN_No,
        contact_number,
        contact_person,
        status,
        user_id,
      ]
    );

    if (result.affectedRows === 1) {
      const supplier_id = result.insertId;
      res.status(201).json({
        success: true,
        message: "Supplier created successfully",
        supplier_id,
      });
    } else {
      res.status(500).json({ success: false, message: "Failed to create supplier" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a supplier
const deleteSupplier = asyncHandler(async (req, res) => {
  try {
    const supplier_id = req.params.id;
    const user_id = req.user.id;

    const [supplierRows] = await pool.query(
      "SELECT * FROM suppliers WHERE supplier_id = ? AND user_id = ?",
      [supplier_id, user_id]
    );

    if (supplierRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this supplier",
      });
    } else {
      const [result] = await pool.query(
        "DELETE FROM suppliers WHERE supplier_id = ?",
        [supplier_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Supplier deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Supplier not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit a supplier
const editSupplier = asyncHandler(async (req, res) => {
  try {
    const supplier_id = req.params.id;
    const {
      supplier_name,
      address,
      PAN_No,
      contact_number,
      contact_person,
      status,
    } = req.body;
    const user_id = req.user.id;

    const [supplierRows] = await pool.query(
      "SELECT * FROM suppliers WHERE supplier_id = ? AND user_id = ?",
      [supplier_id, user_id]
    );

    if (supplierRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to edit this supplier",
      });
    } else {
      const [result] = await pool.query(
        "UPDATE suppliers SET supplier_name = ?, address = ?, PAN_No = ?, contact_number = ?, contact_person = ?, status = ? WHERE supplier_id = ?",
        [
          supplier_name,
          address,
          PAN_No,
          contact_number,
          contact_person,
          status,
          supplier_id,
        ]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Supplier updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Supplier not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all suppliers
const fetchAllSuppliers = asyncHandler(async (req, res) => {
  try {
    const [suppliersRows] = await pool.query(
      "SELECT * FROM suppliers WHERE user_id = ?",
      [req.user.id]
    );

    res.json({ success: true, suppliers: suppliersRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createSupplier,
  deleteSupplier,
  editSupplier,
  fetchAllSuppliers,
};
