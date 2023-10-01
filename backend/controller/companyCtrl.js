const mysql = require("mysql2/promise");
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

// Create a company
const createCompany = asyncHandler(async (req, res) => {
  try {
    const {
      company_name,
      company_address,
      company_email,
      company_contact,
      company_PAN,
      company_type,
      username,
      password,
      ref_link,
    } = req.body;
    const user_id = req.user.id; // Assuming req.user contains user information

    const [result] = await pool.query(
      "INSERT INTO companies (company_name, company_address, company_email, company_contact, company_PAN, company_type, username, password, ref_link, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        company_name,
        company_address,
        company_email,
        company_contact,
        company_PAN,
        company_type,
        username,
        password,
        ref_link,
        user_id,
      ]
    );

    if (result.affectedRows === 1) {
      const company_id = result.insertId;
      res.status(201).json({
        success: true,
        message: "Company created successfully",
        company_id,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to create company" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a company
const deleteCompany = asyncHandler(async (req, res) => {
  try {
    const company_id = req.params.id; // Extract company_id from URL parameter
    const user_id = req.user.id; // Assuming req.user contains user information

    const [companyRows] = await pool.query(
      "SELECT * FROM companies WHERE company_id = ? AND user_id = ?",
      [company_id, user_id]
    );

    if (companyRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this company",
      });
    } else {
      const [result] = await pool.query(
        "DELETE FROM companies WHERE company_id = ?",
        [company_id]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Company deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Company not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit a company
const editCompany = asyncHandler(async (req, res) => {
  try {
    const company_id = req.params.id;
    const {
      company_name,
      company_address,
      company_email,
      company_contact,
      company_PAN,
      company_type,
      username,
      password,
      ref_link,
    } = req.body;
    const user_id = req.user.id;

    const [companyRows] = await pool.query(
      "SELECT * FROM companies WHERE company_id = ? AND user_id = ?",
      [company_id, user_id]
    );

    if (companyRows.length === 0) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to edit this company",
      });
    } else {
      const [result] = await pool.query(
        "UPDATE companies SET company_name = ?, company_address = ?, company_email = ?, company_contact = ?, company_PAN = ?, company_type = ?, username = ?, password = ?, ref_link = ? WHERE company_id = ?",
        [
          company_name,
          company_address,
          company_email,
          company_contact,
          company_PAN,
          company_type,
          username,
          password,
          ref_link,
          company_id,
        ]
      );

      if (result.affectedRows === 1) {
        res.json({ success: true, message: "Company updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Company not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all companies
const fetchAllCompanies = asyncHandler(async (req, res) => {
  try {
    const [companiesRows] = await pool.query(
      "SELECT * FROM companies WHERE user_id = ?",
      [req.user.id]
    );

    res.json({ success: true, companies: companiesRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  createCompany,
  deleteCompany,
  editCompany,
  fetchAllCompanies,
};
