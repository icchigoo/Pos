const express = require("express");
const {
  createStockAdjustment,
  deleteStockAdjustment,
  editStockAdjustment,
  fetchAllStockAdjustments,
} = require("../controller/stock_adjustmentCtrl"); // Import the stock_adjustment controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for stock adjustment operations
router.post("/", authMiddleware, createStockAdjustment); // Create a stock adjustment
router.get("/", authMiddleware, fetchAllStockAdjustments); // Fetch all stock adjustments
router.delete("/:id", authMiddleware, deleteStockAdjustment); // Delete a stock adjustment
router.put("/:id", authMiddleware, editStockAdjustment); // Edit a stock adjustment

module.exports = router;
