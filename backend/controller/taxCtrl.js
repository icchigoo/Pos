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

const createTax = asyncHandler(async (req, res) => {
  try {
    const { tax_name, tax_desc } = req.body;
    const user_id = req.user.id;

    const [result] = await pool.query(
      "INSERT INTO tax (tax_name, tax_desc, user_id) VALUES (?, ?, ?)",
      [tax_name, tax_desc, user_id]
    );

    if (result.affectedRows === 1) {
      const tax_id = result.insertId;
      res.status(201).json({
        success: true,
        message: "Tax created successfully",
        tax_id,
      });
    } else {
      res.status(500).json({ success: false, message: "Failed to create tax" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const deleteTax = asyncHandler(async (req, res) => {
  try {
    const tax_id = req.params.id;
    const user_id = req.user.id;

    const [taxRows] = await pool.query(
      "SELECT * FROM tax WHERE tax_id = ? AND user_id = ?",
      [tax_id, user_id]
    );

    if (taxRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this tax",
      });
    } else {
      const [result] = await pool.query(
        "DELETE FROM tax WHERE tax_id = ?",
        [tax_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Tax deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Tax not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const editTax = asyncHandler(async (req, res) => {
  try {
    const tax_id = req.params.id;
    const { tax_name, tax_desc } = req.body;
    const user_id = req.user.id;

    const [taxRows] = await pool.query(
      "SELECT * FROM tax WHERE tax_id = ? AND user_id = ?",
      [tax_id, user_id]
    );

    if (taxRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to edit this tax",
      });
    } else {
      const [result] = await pool.query(
        "UPDATE tax SET tax_name = ?, tax_desc = ? WHERE tax_id = ?",
        [tax_name, tax_desc, tax_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Tax updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Tax not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const fetchAllTaxes = asyncHandler(async (req, res) => {
  try {
    const [taxRows] = await pool.query(
      "SELECT * FROM tax WHERE user_id = ?",
      [req.user.id]
    );

    res.json({ success: true, taxes: taxRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createTax,
  deleteTax,
  editTax,
  fetchAllTaxes,
};
