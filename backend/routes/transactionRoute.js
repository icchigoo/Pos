const express = require("express");
const {
  createTransaction,
  deleteTransaction,
  editTransaction,
  fetchTransactions,
  updateTransactionStatus,
  getTransactionDetails,
  getServiceStats, 
  getServiceEarnings
} = require("../controller/transactionCtrl");

const router = express.Router();

// Define the routes
router.post("/", createTransaction);
router.get("/fetch", fetchTransactions);
router.delete("/:id", deleteTransaction);
router.put("/:id", editTransaction);
router.post("/:id", updateTransactionStatus);
router.get("/:id", getTransactionDetails);

// Add a new route for transaction statistics by service ID
router.get("/stats/:serviceId", getServiceStats);


module.exports = router;
