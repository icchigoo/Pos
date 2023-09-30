const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Establish a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token:", token); // Add this line
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded:", decoded); // Add this line
        const [userRows] = await pool.query("SELECT * FROM users WHERE id = ?", [decoded?.id]);
        console.log("User Rows:", userRows); // Add this line
        if (userRows.length > 0) {
          req.user = userRows[0];
          console.log("Authenticated User:", req.user); // Add this line
          next();
        } else {
          throw new Error("User not found");
        }
      }
    } catch (error) {
      console.log("Token Verification Error:", error); // Add this line
      throw new Error("Not Authorized token expired, Please Login again");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});


const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  try {
    const [adminUserRows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (adminUserRows.length > 0 && adminUserRows[0].role === "admin") {
      next();
    } else {
      throw new Error("You are not an admin");
    }
  } catch (error) {
    throw new Error("Error checking admin status");
  }
});

module.exports = { authMiddleware, isAdmin };
