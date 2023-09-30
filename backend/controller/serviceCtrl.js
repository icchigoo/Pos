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

exports.createService = async (req, res) => {
  try {
    const { serviceName, description, timeDuration, price, status } = req.body;

    // Insert the service into the services table
    const [result] = await pool.query(
      "INSERT INTO services (serviceName, description, timeDuration, price, status) VALUES (?, ?, ?, ?, ?)",
      [serviceName, description, timeDuration, price, status]
    );

    if (result.affectedRows === 1) {
      const serviceId = result.insertId;



      res.status(201).json({ success: true, message: "Service created successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to create service" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.fetchServices = async (req, res) => {
  try {
    // Fetch all services
    const [servicesRows] = await pool.query("SELECT * FROM services");

    // Return the fetched services
    res.json({ success: true, services: servicesRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id; // Extract serviceId from URL parameter

    // Delete the service from the services table
    const [result] = await pool.query("DELETE FROM services WHERE id = ?", [serviceId]);

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Service deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.editService = async (req, res) => {
  try {
    const serviceId = req.params.id; // Extract serviceId from URL parameter
    const { serviceName, description, timeDuration, price, status } = req.body;

    // Update the service in the services table
    const [result] = await pool.query(
      "UPDATE services SET serviceName = ?, description = ?, timeDuration = ?, price = ?, status = ? WHERE id = ?",
      [serviceName, description, timeDuration, price, status, serviceId]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Service updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


