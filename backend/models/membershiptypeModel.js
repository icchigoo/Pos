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

// Create the "membership_type" table if it doesn't exist
const createMembershipTypeTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS membership_type (
        membership_id INT PRIMARY KEY AUTO_INCREMENT,
        membership_name VARCHAR(255) NOT NULL,
        percentage DECIMAL(5, 2) NOT NULL,
        status VARCHAR(255) DEFAULT 'active',
        user_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Membership Type table created or already exists");
  } catch (error) {
    console.error("Error creating Membership Type table:", error);
  }
};

// Export the function to create the membership_type table
module.exports = {
  createMembershipTypeTable,
};
