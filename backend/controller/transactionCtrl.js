const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

exports.createTransaction = async (req, res) => {
  try {
    const {
      serviceId,
      totalAmount,
      departureTime,
      status,
      timeDuration, // Add timeDuration to the request body
    } = req.body;

    const [result] = await pool.query(
      "INSERT INTO transactions (serviceId, totalAmount, departureTime, status, timeDuration) VALUES (?, ?, ?, ?, ?)",
      [
        serviceId,
        totalAmount,
        departureTime,
        status,
        timeDuration, // Include timeDuration in the query values
      ]
    );

    if (result.affectedRows === 1) {
      const newTransactionId = result.insertId;
      res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        transactionId: newTransactionId,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to create transaction" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.fetchTransactions = async (req, res) => {
  try {
    const { startDate, endDate, month, year, status } = req.query;
    let sql = "SELECT * FROM transactions WHERE 1=1"; // Start with a base query

    if (startDate && endDate) {
      sql += ` AND DATE(created_at) BETWEEN ? AND ?`;
    }

    if (month && year) {
      sql += ` AND MONTH(created_at) = ? AND YEAR(created_at) = ?`;
    }

    if (status) {
      sql += ` AND status = ?`;
    }

    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(startDate, endDate);
    }

    if (month && year) {
      queryParams.push(month, year);
    }

    if (status) {
      queryParams.push(status);
    }

    const [transactionsRows] = await pool.query(sql, queryParams);
    res.json({ success: true, transactions: transactionsRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const [result] = await pool.query("DELETE FROM transactions WHERE id = ?", [
      transactionId,
    ]);

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Transaction deleted successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { status } = req.body;

    const [result] = await pool.query(
      "UPDATE transactions SET status = ? WHERE id = ?",
      [status, transactionId]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Transaction status updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.updateTransactionStatus = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { status, departureTime } = req.body;

    // Check if the provided status is valid (e.g., 'open' or 'closed')
    if (status !== "open" && status !== "closed") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    // Retrieve the transaction details including created and updated timestamps
    const [transactionRows] = await pool.query(
      "SELECT *, TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS timeGapMinutes, timeDuration FROM transactions WHERE id = ?",
      [transactionId]
    );

    if (transactionRows.length !== 1) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    const transactionDetails = transactionRows[0];
    const timeGapMinutes = transactionDetails.timeGapMinutes;
    const timeDuration = transactionDetails.timeDuration; // Assuming timeDuration is in minutes

    // Check if the transaction is already closed
    if (transactionDetails.status === "closed") {
      return res
        .status(400)
        .json({ success: false, message: "Transaction is already closed" });
    }

    // Define fixed amounts and amount increment per 15 minutes
    const fixedAmounts = {
      25: { baseAmount: 25, incrementAmount: 5, initialAmount: 15 },
      75: { baseAmount: 75, incrementAmount: 15, initialAmount: 40 },
    };

    // Parse the totalAmount as a numeric value
    const totalAmount = parseFloat(transactionDetails.totalAmount);

    // Get the fixed amount and initial amount for the transaction
    const { baseAmount, incrementAmount, initialAmount } = fixedAmounts[totalAmount];

    // Calculate the updated total amount based on time gap and fixed time duration
    let updatedTotalAmount;

    if (timeGapMinutes <= 30) {
      // If the user stays within the first 30 minutes, use the initial amount
      updatedTotalAmount = initialAmount;
    } else {
      // Calculate the number of additional 15-minute intervals beyond 60 minutes
      const additionalIntervals = Math.ceil((timeGapMinutes - timeDuration) / 15);

      // Calculate the total amount based on base amount and increment
      updatedTotalAmount = baseAmount + additionalIntervals * incrementAmount;
    }

    // Update the status, departureTime, and totalAmount in the database
    const [result] = await pool.query(
      "UPDATE transactions SET status = ?, departureTime = ?, totalAmount = ? WHERE id = ?",
      [status, departureTime, updatedTotalAmount, transactionId]
    );

    if (result.affectedRows === 1) {
      // Include the updated total amount and time gap in the response
      res.json({
        success: true,
        message: "Transaction status and total amount updated successfully",
        totalAmount: updatedTotalAmount,
        timeGapMinutes: timeGapMinutes,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to update transaction" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};





exports.getTransactionDetails = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const [transactionRows] = await pool.query(
      "SELECT * FROM transactions WHERE id = ?",
      [transactionId]
    );

    if (transactionRows.length === 1) {
      const transactionDetails = transactionRows[0];
      res.json({ success: true, transaction: transactionDetails });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getServiceStats = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;

    // Get the current date
    const currentDate = new Date();

    // Calculate the date for 1 week ago, 1 month ago, and 1 year ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    // Query the database to get transaction counts and earnings for different time periods
    const [transactionStatsRow] = await pool.query(
      `SELECT 
        SUM(CASE WHEN DATE(created_at) = ? THEN 1 ELSE 0 END) AS todayCount,
        SUM(CASE WHEN DATE(created_at) >= ? THEN 1 ELSE 0 END) AS oneWeekCount,
        SUM(CASE WHEN DATE(created_at) >= ? THEN 1 ELSE 0 END) AS oneMonthCount,
        SUM(CASE WHEN DATE(created_at) >= ? THEN 1 ELSE 0 END) AS oneYearCount,
        SUM(CASE WHEN DATE(created_at) = ? THEN totalAmount ELSE 0 END) AS todayEarnings,
        SUM(CASE WHEN DATE(created_at) >= ? THEN totalAmount ELSE 0 END) AS oneWeekEarnings,
        SUM(CASE WHEN DATE(created_at) >= ? THEN totalAmount ELSE 0 END) AS oneMonthEarnings,
        SUM(CASE WHEN DATE(created_at) >= ? THEN totalAmount ELSE 0 END) AS oneYearEarnings
      FROM transactions 
      WHERE serviceId = ?`,
      [
        currentDate.toISOString().split("T")[0],
        oneWeekAgo.toISOString().split("T")[0],
        oneMonthAgo.toISOString().split("T")[0],
        oneYearAgo.toISOString().split("T")[0],
        currentDate.toISOString().split("T")[0],
        oneWeekAgo.toISOString().split("T")[0],
        oneMonthAgo.toISOString().split("T")[0],
        oneYearAgo.toISOString().split("T")[0],
        serviceId,
      ]
    );

    const {
      todayCount,
      oneWeekCount,
      oneMonthCount,
      oneYearCount,
      todayEarnings,
      oneWeekEarnings,
      oneMonthEarnings,
      oneYearEarnings,
    } = transactionStatsRow[0];

    res.json({
      success: true,
      todayCount,
      oneWeekCount,
      oneMonthCount,
      oneYearCount,
      todayEarnings,
      oneWeekEarnings,
      oneMonthEarnings,
      oneYearEarnings,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



