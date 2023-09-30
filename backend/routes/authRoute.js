const express = require("express");
const {
  createUser,
  loginUserCtrl,
  loginAdmin,
  handleRefreshToken,
  fetchAllUsers, // Add the fetchAllUsers function
  editUser,      // Add the editUser function
} = require("../controller/userCtrl"); 

const router = express.Router();

// User registration
router.post("/register", createUser);

// User login
router.post("/login", loginUserCtrl);

// Admin login
router.post("/admin-login", loginAdmin);

// Refresh token
router.get("/refresh", handleRefreshToken);

// Fetch all users (new route)
router.get("/users", fetchAllUsers);

// Edit user information (new route)
router.put("/users/:id", editUser);

module.exports = router;
