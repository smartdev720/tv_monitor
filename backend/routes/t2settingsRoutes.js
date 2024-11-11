const express = require("express");
const {
  getT2SettingsByDeviceId,
  getOnlyT2SettingsByDeviceId,
  updateT2Setting,
  removeOne,
} = require("../controllers/t2settingsController");
const router = express.Router();

router.get("/deviceId/:id", getT2SettingsByDeviceId);
router.get("/get/deviceId/:id", getOnlyT2SettingsByDeviceId);
router.patch("/update-one-row", updateT2Setting);
router.delete("/delete-one/:id", removeOne);

module.exports = router;
