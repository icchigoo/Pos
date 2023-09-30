const mysql = require("mysql2/promise");

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

exports.createCompany = async (req, res) => {
  try {
    const { companyName, companyAddress, companyPanVatNo, companyTelPhone, status } = req.body;

    // Check if there is an existing company
    const [existingCompany] = await pool.query("SELECT id FROM company");

    if (existingCompany.length > 0) {
      // If an existing company is found, delete it
      const [deleteResult] = await pool.query("DELETE FROM company WHERE id = ?", [existingCompany[0].id]);
      if (deleteResult.affectedRows === 1) {
        console.log("Old company deleted successfully");
      } else {
        console.log("Failed to delete old company");
      }
    }

    // Insert the new company into the company table
    const [result] = await pool.query(
      "INSERT INTO company (companyName, companyAddress, companyPanVatNo, companyTelPhone, status) VALUES (?, ?, ?, ?, ?)",
      [companyName, companyAddress, companyPanVatNo, companyTelPhone, status]
    );

    if (result.affectedRows === 1) {
      res.status(201).json({ success: true, message: "Company created successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to create company" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




exports.fetchCompanies = async (req, res) => {
  try {
    // Fetch all companies
    const [companiesRows] = await pool.query("SELECT * FROM company");

    // Return the fetched companies
    res.json({ success: true, companies: companiesRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id; 


    const [result] = await pool.query("DELETE FROM company WHERE id = ?", [companyId]);

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Company deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Company not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.editCompany = async (req, res) => {
  try {
    const companyId = req.params.id; 
    const { companyName, companyAddress, companyPanVatNo, companyTelPhone, status } = req.body;

    // Update the company in the company table
    const [result] = await pool.query(
      "UPDATE company SET companyName = ?, companyAddress = ?, companyPanVatNo = ?, companyTelPhone = ?, status = ? WHERE id = ?",
      [companyName, companyAddress, companyPanVatNo, companyTelPhone, status, companyId]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Company updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Company not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
