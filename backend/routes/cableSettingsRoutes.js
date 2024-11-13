const express = require("express");
const {
  getCableSettingsByDeviceId,
  getChartDataByIdAndDate,
  updateCableSetting,
  removeOne,
  getOnlySettingsByDeviceId,
} = require("../controllers/cableSettingsController");
const router = express.Router();

router.get("/deviceId/:id", getCableSettingsByDeviceId);
router.get("/get/deviceId/:id", getOnlySettingsByDeviceId);
router.post("/get/chart", getChartDataByIdAndDate);
router.patch("/update-one-row", updateCableSetting);
router.delete("/delete-one/:id", removeOne);

module.exports = router;
