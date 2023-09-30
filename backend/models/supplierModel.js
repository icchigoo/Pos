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

// Create the "suppliers" table if it doesn't exist
const createSuppliersTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS suppliers (
        supplier_id INT PRIMARY KEY AUTO_INCREMENT,
        supplier_name VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        PAN_No VARCHAR(255),
        contact_number VARCHAR(255),
        contact_person VARCHAR(255),
        status VARCHAR(255) DEFAULT 'active',
        user_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Suppliers table created or already exists");
  } catch (error) {
    console.error("Error creating suppliers table:", error);
  }
};

// Export the function to create the suppliers table
module.exports = {
  createSuppliersTable,
};
