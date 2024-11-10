const express = require("express");
const {
  runIPTVSettings,
  runAnalogSettings,
  runT2Settings,
  runCableSettings,
} = require("../controllers/runScriptController");
const router = express.Router();

router.post("/iptv-settings", runIPTVSettings);
router.get("/analog-settings", runAnalogSettings);
router.post("/t2-settings", runT2Settings);
router.post("/cable-settings", runCableSettings);

module.exports = router;
