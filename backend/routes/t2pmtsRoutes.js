const express = require("express");
const {
  getT2pmtsBySettingId,
  getT2PmtsBySettingIdBeforeDate,
  updateUnderControlById,
} = require("../controllers/t2pmtsController");
const router = express.Router();

router.get("/settingId/:id", getT2pmtsBySettingId);
router.post("/get-before-date", getT2PmtsBySettingIdBeforeDate);
router.patch("/update-under-control", updateUnderControlById);

module.exports = router;
