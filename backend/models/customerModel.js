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

// Create the "customers" table if it doesn't exist
const createCustomersTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS customers (
        customer_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        membership_id INT,
        FOREIGN KEY (membership_id) REFERENCES membership_type(membership_id)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Customers table created or already exists");
  } catch (error) {
    console.error("Error creating Customers table:", error);
  }
};

// Export the function to create the customers table
module.exports = {
  createCustomersTable,
};
