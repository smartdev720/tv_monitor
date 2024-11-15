const express = require("express");
const {
  getAnalogSettingsByDeviceId,
  getOnlyAnalogSettingsByDeviceId,
  getChartDataByIdAndDate,
  getMultipleAnalogSettingsByLocationIds,
  updateOne,
  getVideoListBySettingId,
} = require("../controllers/analogSettingsController");
const router = express.Router();

router.get("/device/:id", getAnalogSettingsByDeviceId);
router.get("/get/device/:id", getOnlyAnalogSettingsByDeviceId);
router.post("/get/chart", getChartDataByIdAndDate);
router.post("/get-multiple/locations", getMultipleAnalogSettingsByLocationIds);
router.patch("/update-one", updateOne);
router.post("/get/video", getVideoListBySettingId);

module.exports = router;
