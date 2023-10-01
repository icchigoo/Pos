const express = require("express");
const {
  createSale,
  deleteSale,
  editSale,
  fetchAllSales,
} = require("../controller/salesCtrl"); // Import the sale controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for sale operations
router.post("/", authMiddleware, createSale); // Create a sale
router.get("/", authMiddleware, fetchAllSales); // Fetch all sales
router.delete("/:id", authMiddleware, deleteSale); // Delete a sale
router.put("/:id", authMiddleware, editSale); // Edit a sale

module.exports = router;
