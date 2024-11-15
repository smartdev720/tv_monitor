const express = require("express");
const {
  getCableSettingsByDeviceId,
  getChartDataByIdAndDate,
  getMultipleCableSettingsByLocationIds,
  updateCableSetting,
  removeOne,
  getOnlySettingsByDeviceId,
} = require("../controllers/cableSettingsController");
const router = express.Router();

router.get("/deviceId/:id", getCableSettingsByDeviceId);
router.get("/get/deviceId/:id", getOnlySettingsByDeviceId);
router.post("/get/chart", getChartDataByIdAndDate);
router.post("/get-multiple/locations", getMultipleCableSettingsByLocationIds);
router.patch("/update-one-row", updateCableSetting);
router.delete("/delete-one/:id", removeOne);

module.exports = router;
