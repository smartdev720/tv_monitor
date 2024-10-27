const express = require("express");
const {
  getCableSettingsByDeviceId,
  updateCableSetting,
  removeOne,
} = require("../controllers/cableSettingsController");
const router = express.Router();

router.get("/deviceId/:id", getCableSettingsByDeviceId);
router.patch("/update-one-row", updateCableSetting);
router.delete("/delete-one/:id", removeOne);

module.exports = router;
