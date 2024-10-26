const express = require("express");
const {
  getT2SettingsByDeviceId,
  updateT2Setting,
} = require("../controllers/t2settingsController");
const router = express.Router();

router.get("/deviceId/:id", getT2SettingsByDeviceId);
router.patch("/update-one-row", updateT2Setting);

module.exports = router;
