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

// Create a group
const createGroup = asyncHandler(async (req, res) => {
  try {
    const { group_name, group_desc } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Insert the group into the groups table and associate it with the user
    const [result] = await pool.query(
      "INSERT INTO groups (group_name, group_desc, user_id) VALUES (?, ?, ?)",
      [group_name, group_desc, user_id]
    );

    if (result.affectedRows === 1) {
      const group_id = result.insertId;
      res.status(201).json({
        success: true,
        message: "Group created successfully",
        group_id,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to create group" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a group
const deleteGroup = asyncHandler(async (req, res) => {
  try {
    const group_id = req.params.id; // Extract group_id from URL parameter
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user is the creator of the group
    // Check if the user is the creator of the group
    const [groupRows] = await pool.query(
      "SELECT * FROM groups WHERE group_id = ? AND user_id = ?",
      [group_id, user_id]
    );

    if (groupRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this group",
      });
    } else {
      // Delete the group from the groups table
      const [result] = await pool.query(
        "DELETE FROM groups WHERE group_id = ?",
        [group_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Group deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Group not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit a group
const editGroup = asyncHandler(async (req, res) => {
  try {
    const group_id = req.params.id; 
    const { group_name, group_desc, status } = req.body; 
    const user_id = req.user.id; 

    // Check if the user is the creator of the group
    const [groupRows] = await pool.query(
      "SELECT * FROM groups WHERE group_id = ? AND user_id = ?",
      [group_id, user_id]
    );

    if (groupRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to edit this group",
      });
    } else {
      // Update the group in the groups table, including the 'status' field
      const [result] = await pool.query(
        "UPDATE groups SET group_name = ?, group_desc = ?, status = ? WHERE group_id = ?",
        [group_name, group_desc, status, group_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Group updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Group not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Fetch all groups
const fetchAllGroups = asyncHandler(async (req, res) => {
  try {
    // Fetch all groups
    // Fetch all groups associated with the authenticated user
    const [groupsRows] = await pool.query(
      "SELECT * FROM groups WHERE user_id = ?",
      [req.user.id]
    );

    res.json({ success: true, groups: groupsRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createGroup,
  deleteGroup,
  editGroup,
  fetchAllGroups,
};
