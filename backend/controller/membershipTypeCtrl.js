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


exports.createMembershipType = async (req, res) => {
  try {
    const { membershipType, description, status, discountPercentage } = req.body;

    // Insert the membership type into the membershipType table
    const [result] = await pool.query(
      "INSERT INTO membershipType (membershipType, description, status, discountPercentage) VALUES (?, ?, ?, ?)",
      [membershipType, description, status, discountPercentage]
    );

    if (result.affectedRows === 1) {
      res.status(201).json({ success: true, message: "Membership type created successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to create membership type" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.fetchMembershipTypes = async (req, res) => {
  try {
    // Fetch all membership types
    const [membershipTypesRows] = await pool.query("SELECT * FROM membershipType");

    // Return the fetched membership types
    res.json({ success: true, membershipTypes: membershipTypesRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    const {
      membershipTypeId,
      memberName,
      memberAddress,
      memberEmail,
      memberPhone,
      startDate,
      endDate,
      status,
      discountPercentage
    } = req.body;

    // Insert the member into the Membership table
    const [result] = await pool.query(
      "INSERT INTO Membership (membershipTypeId, memberName, memberAddress, memberEmail, memberPhone, startDate, endDate, status, discountPercentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [membershipTypeId, memberName, memberAddress, memberEmail, memberPhone, startDate, endDate, status, discountPercentage]
    );

    if (result.affectedRows === 1) {
      res.status(201).json({ success: true, message: "Member created successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to create member" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.fetchMembers = async (req, res) => {
  try {
    // Fetch all members
    const [membersRows] = await pool.query("SELECT * FROM Membership");

    // Return the fetched members
    res.json({ success: true, members: membersRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.deleteMembershipType = async (req, res) => {
  try {
    const membershipTypeId = req.params.id;

    // Update dependent rows in Membership table
    await pool.query(
      "UPDATE Membership SET membershipTypeId = NULL WHERE membershipTypeId = ?",
      [membershipTypeId]
    );

    // Delete the membership type from the membershipType table
    const [result] = await pool.query(
      "DELETE FROM membershipType WHERE id = ?",
      [membershipTypeId]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Membership type deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Membership type not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.deleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;

    // Delete the member from the Membership table
    const [result] = await pool.query(
      "DELETE FROM Membership WHERE id = ?",
      [memberId]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Member deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Member not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.editMembershipType = async (req, res) => {
  try {
    const membershipTypeId = req.params.id;
    const { membershipType, description, status, discountPercentage } = req.body;

    // Update the membership type in the membershipType table
    const [result] = await pool.query(
      "UPDATE membershipType SET membershipType = ?, description = ?, status = ?, discountPercentage = ? WHERE id = ?",
      [membershipType, description, status, discountPercentage, membershipTypeId]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Membership type updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Membership type not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.editMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const {
      membershipTypeId,
      memberName,
      memberAddress,
      memberEmail,
      memberPhone,
      startDate,
      endDate,
      status,
      discountPercentage
    } = req.body;

    // Update the member in the Membership table
    const [result] = await pool.query(
      "UPDATE Membership SET membershipTypeId = ?, memberName = ?, memberAddress = ?, memberEmail = ?, memberPhone = ?, startDate = ?, endDate = ?, status = ?, discountPercentage = ? WHERE id = ?",
      [membershipTypeId, memberName, memberAddress, memberEmail, memberPhone, startDate, endDate, status, discountPercentage, memberId]
    );

    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Member updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Member not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



