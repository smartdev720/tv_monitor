const express = require("express");
const { getAllChannels } = require("../controllers/channelsController");
const router = express.Router();

router.get("/all", getAllChannels);

module.exports = router;
