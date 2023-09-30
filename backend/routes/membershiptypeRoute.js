const express = require("express");
const {
  createMembershipType,
  deleteMembershipType,
  editMembershipType,
  fetchAllMembershipTypes,
} = require("../controller/membershipTypeCtrl"); // Import the membership type controller
const { authMiddleware } = require("../middlewares/authMiddleware"); // Import the auth middleware
const router = express.Router();

// Define routes for membership type operations
router.post("/", authMiddleware, createMembershipType); // Create a membership type
router.get("/", authMiddleware, fetchAllMembershipTypes); // Fetch all membership types
router.delete("/:id", authMiddleware, deleteMembershipType); // Delete a membership type
router.put("/:id", authMiddleware, editMembershipType); // Edit a membership type

module.exports = router;
