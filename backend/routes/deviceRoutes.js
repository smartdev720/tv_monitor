const express = require("express");
const { getAllDevices, updateOne } = require("../controllers/deviceController");
const router = express.Router();

router.get("/all", getAllDevices);
router.patch("/update-one", updateOne);

module.exports = router;
