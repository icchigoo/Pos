const express = require("express");
const {
  createGroup,
  deleteGroup,
  editGroup,
  fetchAllGroups,
} = require("../controller/groupCtrl"); 
const { authMiddleware } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// Define routes for group operations
router.post("/", authMiddleware, createGroup); 
router.get("/", authMiddleware, fetchAllGroups); 
router.delete("/:id", authMiddleware, deleteGroup); 
router.put("/:id", authMiddleware, editGroup); 

module.exports = router;
