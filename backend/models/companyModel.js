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

// Create the "companies" table if it doesn't exist
const createCompaniesTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS companies (
        company_id INT PRIMARY KEY AUTO_INCREMENT,
        company_name VARCHAR(255) NOT NULL,
        company_address VARCHAR(255) NOT NULL,
        company_email VARCHAR(255) NOT NULL,
        company_contact VARCHAR(255) NOT NULL,
        company_PAN VARCHAR(255) NOT NULL,
        company_type VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        ref_link VARCHAR(255),
        user_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Companies table created or already exists");
  } catch (error) {
    console.error("Error creating companies table:", error);
  }
};

// Export the function to create the companies table
module.exports = {
  createCompaniesTable,
};
