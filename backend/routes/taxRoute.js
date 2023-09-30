const express = require("express");
const {
  createTax,
  deleteTax,
  editTax,
  fetchAllTaxes,
} = require("../controller/taxCtrl"); // Import the tax controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for tax operations
router.post("/", authMiddleware, createTax); // Create a tax
router.get("/", authMiddleware, fetchAllTaxes); // Fetch all taxes
router.delete("/:id", authMiddleware, deleteTax); // Delete a tax
router.put("/:id", authMiddleware, editTax); // Edit a tax

module.exports = router;
