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

// Create a category
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { category_name, category_desc, status, group_id } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user is the creator of the group associated with the category
    const [groupRows] = await pool.query(
      "SELECT * FROM groups WHERE group_id = ? AND user_id = ?",
      [group_id, user_id]
    );

    if (groupRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to create a category for this group",
      });
    } else {
      // Insert the category into the categories table and associate it with the group
      const [result] = await pool.query(
        "INSERT INTO categories (category_name, category_desc, group_id) VALUES (?, ?, ?)",
        [category_name, category_desc, group_id]
      );
      

      if (result.affectedRows === 1) {
        const category_id = result.insertId;
        res.status(201).json({
          success: true,
          message: "Category created successfully",
          category_id,
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to create category" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category_id = req.params.id; // Extract category_id from URL parameter
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user is the creator of the group associated with the category
    const [categoryRows] = await pool.query(
      "SELECT c.category_id FROM categories c JOIN groups g ON c.group_id = g.group_id WHERE c.category_id = ? AND g.user_id = ?",
      [category_id, user_id]
    );

    if (categoryRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this category",
      });
    } else {
      // Delete the category from the categories table
      const [result] = await pool.query(
        "DELETE FROM categories WHERE category_id = ?",
        [category_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Category deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Category not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit a category
const editCategory = asyncHandler(async (req, res) => {
  try {
    const category_id = req.params.id; // Extract category_id from URL parameter
    const { category_name, category_desc, status, group_id } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    // Check if the user is the creator of the group associated with the category
    const [categoryRows] = await pool.query(
      "SELECT c.category_id FROM categories c JOIN groups g ON c.group_id = g.group_id WHERE c.category_id = ? AND g.user_id = ?",
      [category_id, user_id]
    );

    if (categoryRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to edit this category",
      });
    } else {
      // Update the category in the categories table, including the 'status' field
      const [result] = await pool.query(
        "UPDATE categories SET category_name = ?, category_desc = ?, status = ?, group_id = ? WHERE category_id = ?",
        [category_name, category_desc, status, group_id, category_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Category updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Category not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all categories
const fetchAllCategories = asyncHandler(async (req, res) => {
  try {
    // Fetch all categories associated with the authenticated user's groups
    const [categoriesRows] = await pool.query(
      "SELECT c.* FROM categories c JOIN groups g ON c.group_id = g.group_id WHERE g.user_id = ?",
      [req.user.id]
    );

    res.json({ success: true, categories: categoriesRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createCategory,
  deleteCategory,
  editCategory,
  fetchAllCategories,
};
