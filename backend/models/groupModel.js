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

// Create the "groups" table if it doesn't exist
const createGroupsTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS groups (
        group_id INT PRIMARY KEY AUTO_INCREMENT,
        group_name VARCHAR(255) NOT NULL,
        group_desc VARCHAR(255),
        status VARCHAR(255) DEFAULT 'active',
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) 
      )
    `;
    await pool.query(createTableQuery);
    console.log("Groups table created or already exists");
  } catch (error) {
    console.error("Error creating groups table:", error);
  }
};

// Export the function to create the groups table
module.exports = {
  createGroupsTable,
};
