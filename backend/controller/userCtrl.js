const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const asyncHandler = require("express-async-handler");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create a User
const createUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;

  // Check if user with given email already exists
  const [existingUser] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!existingUser.length) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const [result] = await pool.query(
      "INSERT INTO users (firstname, lastname, email, mobile, password) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, mobile, hashedPassword]
    );

    if (result.affectedRows === 1) {
      res.json({ message: "User created successfully" });
    } else {
      throw new Error("Failed to create user");
    }
  } else {
    throw new Error("User Already Exists");
  }
});

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Fetch user by email
  const [userRows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  const user = userRows[0];

  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate and update refresh token
    const refreshToken = await generateRefreshToken(user.id);
    await pool.query("UPDATE users SET refreshToken = ? WHERE id = ?", [
      refreshToken,
      user.id,
    ]);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Login an admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Fetch admin by email
  const [adminRows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  const admin = adminRows[0];

  if (!admin || admin.role !== "admin") {
    throw new Error("Not Authorized");
  }

  if (admin && (await bcrypt.compare(password, admin.password))) {
    // Generate and update refresh token
    const refreshToken = await generateRefreshToken(admin.id);
    await pool.query("UPDATE users SET refreshToken = ? WHERE id = ?", [
      refreshToken,
      admin.id,
    ]);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: admin.id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      email: admin.email,
      mobile: admin.mobile,
      role: admin.role,
      token: generateToken(admin.id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.refreshToken) {
    throw new Error("No Refresh Token in Cookies");
  }

  const refreshToken = cookie.refreshToken;

  // Fetch user by refreshToken
  const [userRows] = await pool.query(
    "SELECT * FROM users WHERE refreshToken = ?",
    [refreshToken]
  );
  const user = userRows[0];

  if (!user) {
    throw new Error("No Refresh token present in db or not matched");
  }

  // Verify refresh token
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (user.id !== decoded.id) {
      throw new Error("There is something wrong with the refresh token");
    }

    const accessToken = generateToken(user.id);
    res.json({ accessToken });
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
});

// Fetch all users
const fetchAllUsers = asyncHandler(async (req, res) => {
  // Fetch all user records from the database
  const [users] = await pool.query("SELECT * FROM users");
  res.json(users);
});

// Edit user information (including password)
const editUser = asyncHandler(async (req, res) => {
  const { id } = req.params; // Assuming you provide the user ID in the URL params
  const { firstname, lastname, email, mobile, password, role } = req.body;

  // Check if the user exists
  const [userRows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  const user = userRows[0];

  if (!user) {
    throw new Error("User not found");
  }

  // Update user information, including the role if provided
  await pool.query(
    "UPDATE users SET firstname = ?, lastname = ?, email = ?, mobile = ?, role = ? WHERE id = ?",
    [firstname, lastname, email, mobile, role, id]
  );

  // If a new password is provided, hash and update it
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      id,
    ]);
  }

  res.json({ message: "User information updated successfully" });
});

module.exports = {
  createUser,
  loginUserCtrl,
  loginAdmin,
  handleRefreshToken,
  fetchAllUsers,
  editUser,
};
