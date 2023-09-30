const express = require("express");


const {
     createMember, fetchMembers, deleteMember, editMember


} = require("../controller/membershipTypeCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/create", createMember);
router.get("/fetch", fetchMembers);
router.delete("/delete/:id",deleteMember);
router.delete("/edit/:id",  editMember);







module.exports = router;
