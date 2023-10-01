const express = require("express");
const {
  createCustomer,
  deleteCustomer,
  editCustomer,
  fetchAllCustomers,
} = require("../controller/customerCtrl"); // Import the customer controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for customer operations
router.post("/", authMiddleware, createCustomer); // Create a customer
router.get("/", authMiddleware, fetchAllCustomers); // Fetch all customers
router.delete("/:id", authMiddleware, deleteCustomer); // Delete a customer
router.put("/:id", authMiddleware, editCustomer); // Edit a customer

module.exports = router;
