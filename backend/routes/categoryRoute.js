const express = require("express");
const {
  createCategory,
  deleteCategory,
  editCategory,
  fetchAllCategories,
} = require("../controller/categoryCtrl"); // Import the category controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for category operations
router.post("/", authMiddleware, createCategory); // Create a category
router.get("/", authMiddleware, fetchAllCategories); // Fetch all categories
router.delete("/:id", authMiddleware, deleteCategory); // Delete a category
router.put("/:id", authMiddleware, editCategory); // Edit a category

module.exports = router;
