const express = require("express");
const {
  createProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} = require("../controller/productCtrl"); // Import the product controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for product operations
router.post("/", authMiddleware, createProduct); // Create a product
router.get("/", authMiddleware, fetchAllProducts); // Fetch all products
router.delete("/:id", authMiddleware, deleteProduct); // Delete a product
router.put("/:id", authMiddleware, editProduct); // Edit a product

module.exports = router;
