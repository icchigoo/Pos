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

const createMembershipType = asyncHandler(async (req, res) => {
  try {
    const { membership_name, percentage } = req.body;
    const user_id = req.user.id;

    const [result] = await pool.query(
      "INSERT INTO membership_type (membership_name, percentage, user_id) VALUES (?, ?, ?)",
      [membership_name, percentage, user_id]
    );

    if (result.affectedRows === 1) {
      const membership_id = result.insertId;
      res.status(201).json({
        success: true,
        message: "Membership type created successfully",
        membership_id,
      });
    } else {
      res.status(500).json({ success: false, message: "Failed to create membership type" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const deleteMembershipType = asyncHandler(async (req, res) => {
  try {
    const membership_id = req.params.id;
    const user_id = req.user.id;

    const [membershipRows] = await pool.query(
      "SELECT * FROM membership_type WHERE membership_id = ? AND user_id = ?",
      [membership_id, user_id]
    );

    if (membershipRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this membership type",
      });
    } else {
      const [result] = await pool.query(
        "DELETE FROM membership_type WHERE membership_id = ?",
        [membership_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Membership type deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Membership type not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const editMembershipType = asyncHandler(async (req, res) => {
  try {
    const membership_id = req.params.id;
    const { membership_name, percentage } = req.body;
    const user_id = req.user.id;

    const [membershipRows] = await pool.query(
      "SELECT * FROM membership_type WHERE membership_id = ? AND user_id = ?",
      [membership_id, user_id]
    );

    if (membershipRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to edit this membership type",
      });
    } else {
      const [result] = await pool.query(
        "UPDATE membership_type SET membership_name = ?, percentage = ? WHERE membership_id = ?",
        [membership_name, percentage, membership_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Membership type updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Membership type not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const fetchAllMembershipTypes = asyncHandler(async (req, res) => {
  try {
    const [membershipRows] = await pool.query(
      "SELECT * FROM membership_type WHERE user_id = ?",
      [req.user.id]
    );

    res.json({ success: true, membershipTypes: membershipRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createMembershipType,
  deleteMembershipType,
  editMembershipType,
  fetchAllMembershipTypes,
};
