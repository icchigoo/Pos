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

// Create the "sales" table if it doesn't exist
const createSalesTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS sales (
        sale_id INT PRIMARY KEY AUTO_INCREMENT,
        products JSON,
        discount_amt DECIMAL(10, 2) NOT NULL,
        discount_percentage DECIMAL(5, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        sales_date DATE NOT NULL,
        payment_method VARCHAR(255) NOT NULL
      )
    `;
    await pool.query(createTableQuery);
    console.log("Sales table created or already exists");
  } catch (error) {
    console.error("Error creating sales table:", error);
  }
};


// Export the function to create the sales table
module.exports = {
  createSalesTable,
};
