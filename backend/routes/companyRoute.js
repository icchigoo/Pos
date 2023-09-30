const express = require("express");


const {
createCompany, fetchCompanies, deleteCompany,editCompany


} = require("../controller/compnayCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createCompany);
router.get("/fetch", fetchCompanies);
router.delete("/delete/:id",  deleteCompany);
router.put("/edit/:id",editCompany);




module.exports = router;
