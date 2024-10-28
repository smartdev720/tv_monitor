const express = require("express");
const {
  getAnalogSettingsByDeviceId,
  updateOne,
} = require("../controllers/analogSettingsController");
const router = express.Router();

router.get("/device/:id", getAnalogSettingsByDeviceId);
router.patch("/update-one", updateOne);

module.exports = router;
