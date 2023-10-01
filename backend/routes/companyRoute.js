const express = require("express");
const {
  createCompany,
  deleteCompany,
  editCompany,
  fetchAllCompanies,
} = require("../controller/companyCtrl"); // Import the company controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for company operations
router.post("/", authMiddleware, createCompany); // Create a company
router.get("/", authMiddleware, fetchAllCompanies); // Fetch all companies
router.delete("/:id", authMiddleware, deleteCompany); // Delete a company
router.put("/:id", authMiddleware, editCompany); // Edit a company

module.exports = router;
