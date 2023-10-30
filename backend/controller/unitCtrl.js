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

// Create a unit
const createUnit = asyncHandler(async (req, res) => {
  try {
    const { unit_name, group_desc, status } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Insert the unit into the unit table and associate it with the user
    const [result] = await pool.query(
      "INSERT INTO unit (unit_name, group_desc, status, user_id) VALUES (?, ?, ?, ?)",
      [unit_name, group_desc, status, user_id]
    );

    if (result.affectedRows === 1) {
      const unit_id = result.insertId;
      res.status(201).json({
        success: true,
        message: "Unit created successfully",
        unit_id,
      });
    } else {
      res.status(500).json({ success: false, message: "Failed to create unit" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a unit
const deleteUnit = asyncHandler(async (req, res) => {
  try {
    const unit_id = req.params.id; // Extract unit_id from URL parameter
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user has permission to delete the unit
    const [unitRows] = await pool.query(
      "SELECT * FROM unit WHERE unit_id = ? AND user_id = ?",
      [unit_id, user_id]
    );

    if (unitRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this unit",
      });
    } else {
      // Delete the unit from the unit table
      const [result] = await pool.query(
        "DELETE FROM unit WHERE unit_id = ?",
        [unit_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Unit deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Unit not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit a unit
const editUnit = asyncHandler(async (req, res) => {
  try {
    const unit_id = req.params.id;
    const { unit_name, group_desc, status } = req.body;
    const user_id = req.user.id;

    // Check if the user has permission to edit the unit
    const [unitRows] = await pool.query(
      "SELECT * FROM unit WHERE unit_id = ? AND user_id = ?",
      [unit_id, user_id]
    );

    if (unitRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to edit this unit",
      });
    } else {
      // Update the unit in the unit table
      const [result] = await pool.query(
        "UPDATE unit SET unit_name = ?, group_desc = ?, status = ? WHERE unit_id = ?",
        [unit_name, group_desc, status, unit_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Unit updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Unit not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all units
const fetchAllUnits = asyncHandler(async (req, res) => {
  try {
    const [unitRows] = await pool.query(
      "SELECT * FROM unit WHERE user_id = ?",
      [req.user.id]
    );

    res.json({ success: true, units: unitRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createUnit,
  deleteUnit,
  editUnit,
  fetchAllUnits,
};
