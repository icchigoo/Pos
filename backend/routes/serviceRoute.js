const express = require("express");


const {
createService, fetchServices, deleteService, editService


} = require("../controller/serviceCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/",  createService);
router.get("/services", fetchServices);
router.delete("/services/:id", deleteService);
router.put("/edit/:id", editService);




module.exports = router;
