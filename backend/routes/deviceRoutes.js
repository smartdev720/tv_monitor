const express = require("express");
const { getAllDevices } = require("../controllers/deviceController");
const router = express.Router();

router.get("/all", getAllDevices);

module.exports = router;
