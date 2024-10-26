const express = require("express");
const { runIPTVSettings } = require("../controllers/runScriptController");
const router = express.Router();

router.post("/iptv-settings", runIPTVSettings);

module.exports = router;
