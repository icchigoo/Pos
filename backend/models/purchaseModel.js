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

// Create the "purchase" table if it doesn't exist
const createPurchaseTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS purchase (
        purchase_id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT,
        supplier_id INT,
        bill_no VARCHAR(255) NOT NULL,
        bill_date DATE NOT NULL,
        entry_date DATE NOT NULL,
        qty INT NOT NULL,
        purchase_rate DECIMAL(10, 2) NOT NULL,
        discount_rate DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        vat DECIMAL(10, 2) NOT NULL,
        grand_total DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(product_id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Purchase table created or already exists");
  } catch (error) {
    console.error("Error creating purchase table:", error);
  }
};

// Export the function to create the purchase table
module.exports = {
  createPurchaseTable,
};
