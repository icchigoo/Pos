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

// Create a Company table
const createCompanyTable = async () => {
  const createTableQuery = `
    CREATE TABLE company (
      id INT PRIMARY KEY AUTO_INCREMENT,
      companyName VARCHAR(255) NOT NULL,
      companyAddress TEXT NOT NULL,
      companyPanVatNo VARCHAR(50) NOT NULL,
      companyTelPhone VARCHAR(20) NOT NULL,
      status ENUM('Active', 'Inactive') DEFAULT 'Inactive',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  try {
    const connection = await pool.getConnection();
    await connection.query(createTableQuery);
    console.log("Company table created successfully");
    connection.release();
  } catch (error) {
    console.error("Error creating Company table:", error);
  }
};

// Create the Company table
createCompanyTable();
