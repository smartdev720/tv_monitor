const express = require("express");
const {
  getCableSettingsByDeviceId,
  updateCableSetting,
} = require("../controllers/cableSettingsController");
const router = express.Router();

router.get("/deviceId/:id", getCableSettingsByDeviceId);
router.patch("/update-one-row", updateCableSetting);

module.exports = router;
