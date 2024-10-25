const express = require("express");
const {
  getAnalogSettingsByDeviceId,
} = require("../controllers/analogSettingsController");
const router = express.Router();

router.get("/device/:id", getAnalogSettingsByDeviceId);

module.exports = router;
