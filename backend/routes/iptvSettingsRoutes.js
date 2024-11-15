const express = require("express");
const {
  getAllByDeviceId,
  getVideoListByIdAndDate,
  getMultipleIPTVSettingsByLocationIds,
  updateOne,
  removeOne,
} = require("../controllers/iptvSettingsController");
const router = express.Router();

router.get("/deviceId/:id", getAllByDeviceId);
router.post("/get-multiple/locations", getMultipleIPTVSettingsByLocationIds);
router.patch("/update-one", updateOne);
router.post("/get/video", getVideoListByIdAndDate);
router.delete("/delete-one/:id", removeOne);

module.exports = router;
