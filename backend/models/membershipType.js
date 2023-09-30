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

// Define the membershipType table schema
const membershipTypeSchema = `
  CREATE TABLE IF NOT EXISTS membershipType (
    id INT PRIMARY KEY AUTO_INCREMENT,
    membershipType VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(255) DEFAULT 'inactive',
    discountPercentage DECIMAL(5, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

// Define the Membership table schema with foreign key
const membershipSchema = `
  CREATE TABLE IF NOT EXISTS Membership (
    id INT PRIMARY KEY AUTO_INCREMENT,
    membershipTypeId INT,
    memberName VARCHAR(255),
    memberAddress TEXT ,
    memberEmail VARCHAR(255),
    memberPhone VARCHAR(20),
    startDate DATE ,
    endDate DATE,
    status VARCHAR(255) DEFAULT 'active',
    discountPercentage DECIMAL(5, 2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (membershipTypeId) REFERENCES membershipType(id)
  )
`;

// Create membershipType and Membership tables
const createTables = async () => {
  try {
    await pool.query(membershipTypeSchema);
    console.log("MembershipType table created successfully");
    
    await pool.query(membershipSchema);
    console.log("Membership table created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};



// Call the function to create tables during setup
createTables();
