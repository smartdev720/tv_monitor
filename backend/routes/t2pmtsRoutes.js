const express = require("express");
const {
  getT2pmtsBySettingId,
  updateUnderControlById,
} = require("../controllers/t2pmtsController");
const router = express.Router();

router.get("/settingId/:id", getT2pmtsBySettingId);
router.patch("/update-under-control", updateUnderControlById);

module.exports = router;
