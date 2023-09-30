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

// Create the "tax" table if it doesn't exist
const createTaxTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tax (
        tax_id INT PRIMARY KEY AUTO_INCREMENT,
        tax_name VARCHAR(255) NOT NULL,
        tax_desc VARCHAR(255),
        status VARCHAR(255) DEFAULT 'active',
        user_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Tax table created or already exists");
  } catch (error) {
    console.error("Error creating tax table:", error);
  }
};

// Export the function to create the tax table
module.exports = {
  createTaxTable,
};
