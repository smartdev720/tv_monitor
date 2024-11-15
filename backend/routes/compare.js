const express = require("express");
const { getCompareBadData } = require("../controllers/compareController");
const router = express.Router();

router.post("/get/bad-data", getCompareBadData);

module.exports = router;
