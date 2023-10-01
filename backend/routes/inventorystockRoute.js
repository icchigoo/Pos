const express = require("express");
const {
  createInventoryStock,
  deleteInventoryStock,
  editInventoryStock,
  fetchAllInventoryStocks,
} = require("../controller/inventoryStockCtrl"); // Import the inventory stock controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for inventory stock operations
router.post("/", authMiddleware, createInventoryStock); // Create an inventory stock
router.get("/", authMiddleware, fetchAllInventoryStocks); // Fetch all inventory stocks
router.delete("/:id", authMiddleware, deleteInventoryStock); // Delete an inventory stock
router.put("/:id", authMiddleware, editInventoryStock); // Edit an inventory stock

module.exports = router;
