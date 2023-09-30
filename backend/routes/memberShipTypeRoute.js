const express = require("express");


const {
    createMembershipType, fetchMembershipTypes, deleteMembershipType, editMembershipType


} = require("../controller/membershipTypeCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createMembershipType);
router.get("/fetch", fetchMembershipTypes);
router.delete("/delete/:id",  deleteMembershipType);
router.delete("/edit/:id",  editMembershipType);








module.exports = router;
