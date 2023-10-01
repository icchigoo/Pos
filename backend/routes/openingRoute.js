const express = require("express");
const {
  createOpeningStock,
  deleteOpeningStock,
  editOpeningStock,
  fetchAllOpeningStock,
} = require("../controller/openingCtrl"); // Import the opening stock controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for opening stock operations
router.post("/", authMiddleware, createOpeningStock); // Create an opening stock entry
router.get("/", authMiddleware, fetchAllOpeningStock); // Fetch all opening stock entries
router.delete("/:id", authMiddleware, deleteOpeningStock); // Delete an opening stock entry
router.put("/:id", authMiddleware, editOpeningStock); // Edit an opening stock entry

module.exports = router;
