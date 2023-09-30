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

// Create a Service table
const createServiceTable = async () => {
  const createTableQuery = `
    CREATE TABLE services (
      id INT PRIMARY KEY AUTO_INCREMENT,
      serviceName VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      timeDuration INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(255) DEFAULT 'inactive',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Service table created successfully");
  } catch (error) {
    console.error("Error creating Service table:", error);
  }
};



module.exports = {
  createServiceTable,


};
