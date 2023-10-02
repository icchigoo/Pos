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

// Create the "inventory_stock" table if it doesn't exist
const createInventoryStockTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS inventory_stock (
        stock_id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT,
        stock_qty INT NOT NULL,
        purchase_rate DECIMAL(10, 2) NOT NULL,
        total_purchased_balance DECIMAL(10, 2) NOT NULL,
        stock_adj_id INT,
        sales_id INT,
        total_stock_qty INT NOT NULL,
        total_stock_balance DECIMAL(10, 2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(product_id), -- Replace with the actual referenced table
        FOREIGN KEY (stock_adj_id) REFERENCES stock_adjustment(stock_adj_id), -- Replace with the actual referenced table
        FOREIGN KEY (sales_id) REFERENCES sales(sale_id) -- Replace with the actual referenced table
      )
    `;
    await pool.query(createTableQuery);
    console.log("Inventory Stock table created or already exists");
  } catch (error) {
    console.error("Error creating Inventory Stock table:", error);
  }
};

// Export the function to create the inventory stock table
module.exports = {
  createInventoryStockTable,
};
