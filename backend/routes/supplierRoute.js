const express = require("express");
const {
  createSupplier,
  deleteSupplier,
  editSupplier,
  fetchAllSuppliers,
} = require("../controller/supplierCtrl"); // Import the supplier controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for supplier operations
router.post("/", authMiddleware, createSupplier); // Create a supplier
router.get("/", authMiddleware, fetchAllSuppliers); // Fetch all suppliers
router.delete("/:id", authMiddleware, deleteSupplier); // Delete a supplier
router.put("/:id", authMiddleware, editSupplier); // Edit a supplier

module.exports = router;
