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

// Create the "categories" table if it doesn't exist
const createCategoriesTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS categories (
        category_id INT PRIMARY KEY AUTO_INCREMENT,
        category_name VARCHAR(255) NOT NULL,
        category_desc VARCHAR(255),
        status VARCHAR(255) DEFAULT 'active',
        group_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(group_id)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Categories table created or already exists");
  } catch (error) {
    console.error("Error creating categories table:", error);
  }
};

// Export the function to create the categories table
module.exports = {
  createCategoriesTable,
};
