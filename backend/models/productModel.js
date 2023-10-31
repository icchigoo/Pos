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

// Create the "products" table if it doesn't exist
const createProductsTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        product_id INT PRIMARY KEY AUTO_INCREMENT,
        product_name VARCHAR(255) NOT NULL,
        product_desc VARCHAR(255),
        status VARCHAR(255) DEFAULT 'active',
        category_id INT,
        unit_id INT,  -- Add a unit_id field for the foreign key relationship
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(category_id),
        FOREIGN KEY (unit_id) REFERENCES unit(unit_id)  -- Add a foreign key constraint to the unit table
      )
    `;
    await pool.query(createTableQuery);
    console.log("Products table created or already exists");
  } catch (error) {
    console.error("Error creating products table:", error);
  }
};

// Export the function to create the products table
module.exports = {
  createProductsTable,
};
