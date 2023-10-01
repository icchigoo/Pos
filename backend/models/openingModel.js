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

// Create the "opening_stock" table if it doesn't exist
const createOpeningStockTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS opening_stock (
        opening_stock_id INT PRIMARY KEY AUTO_INCREMENT,
        opening_qty INT NOT NULL,
        opening_purchase_rate DECIMAL(10, 2) NOT NULL,
        opening_sale_rate DECIMAL(10, 2) NOT NULL,
        product_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Opening Stock table created or already exists");
  } catch (error) {
    console.error("Error creating opening stock table:", error);
  }
};

// Export the function to create the opening_stock table
module.exports = {
  createOpeningStockTable,
};
