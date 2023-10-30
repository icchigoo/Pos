const express = require("express");
const {
  createUnit,
  deleteUnit,
  editUnit,
  fetchAllUnits,
} = require("../controller/unitCtrl"); // Import the unit controller
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

// Define routes for unit operations
router.post("/", authMiddleware, createUnit); // Create a unit
router.get("/", authMiddleware, fetchAllUnits); // Fetch all units
router.delete("/:id", authMiddleware, deleteUnit); // Delete a unit
router.put("/:id", authMiddleware, editUnit); // Edit a unit

module.exports = router;
