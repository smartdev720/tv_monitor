const express = require("express");
const {
  getCablepmtsBySettingId,
  updateUnderControlById,
} = require("../controllers/cablePmtsController");
const router = express.Router();

router.get("/settingId/:id", getCablepmtsBySettingId);
router.patch("/update-under-control", updateUnderControlById);

module.exports = router;
