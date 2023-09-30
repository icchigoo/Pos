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

// Create the "stock_adjustment" table if it doesn't exist
const createStockAdjustmentTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS stock_adjustment (
        stock_adj_id INT PRIMARY KEY AUTO_INCREMENT,
        adjustment_title VARCHAR(255) NOT NULL,
        adjustment_qty INT NOT NULL,
        adjustment_type ENUM('increase', 'decrease') NOT NULL,
        reason VARCHAR(255) NOT NULL,
        product_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Stock Adjustment table created or already exists");
  } catch (error) {
    console.error("Error creating Stock Adjustment table:", error);
  }
};

// Export the function to create the stock_adjustment table
module.exports = {
  createStockAdjustmentTable,
};
