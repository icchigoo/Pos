const mysql = require("mysql2");

const dbConnect = () => {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
      }
      console.log("Connected to MySQL database successfully");
    });

    return connection; // Return the connection object
  } catch (error) {
    console.error("Database error:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
};

module.exports = dbConnect;
