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

// Create a Transaction table
const createTransactionTable = async () => {
  // SQL query to create the transactions table with the timeDuration field
  const createTableQuery = `
    CREATE TABLE transactions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      serviceId INT NOT NULL,
      totalAmount DECIMAL(10, 2) NOT NULL,
      timeDuration INT NOT NULL, 
      departureTime DATETIME,
      status VARCHAR(255) DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (serviceId) REFERENCES services(id)
    );
  `;

  try {
    // Execute the create table query
    await pool.query(createTableQuery);
    console.log("Transaction table created successfully");
  } catch (error) {
    console.error("Error creating Transaction table:", error);
  }
};




module.exports = {
  createTransactionTable,
};
