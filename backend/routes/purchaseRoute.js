const express = require("express");
const {
  createPurchase,
  deletePurchase,
  editPurchase,
  fetchAllPurchases,
} = require("../controller/purchaseCtrl"); // Import the purchase controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for purchase operations
router.post("/", authMiddleware, createPurchase); // Create a purchase
router.get("/", authMiddleware, fetchAllPurchases); // Fetch all purchases
router.delete("/:id", authMiddleware, deletePurchase); // Delete a purchase
router.put("/:id", authMiddleware, editPurchase); // Edit a purchase

module.exports = router;
