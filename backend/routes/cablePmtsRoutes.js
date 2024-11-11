const express = require("express");
const {
  getCablepmtsBySettingId,
  getCablepmtsBySettingIdBeforeDate,
  updateUnderControlById,
} = require("../controllers/cablePmtsController");
const router = express.Router();

router.get("/settingId/:id", getCablepmtsBySettingId);
router.post("/get-before-date", getCablepmtsBySettingIdBeforeDate);
router.patch("/update-under-control", updateUnderControlById);

module.exports = router;
