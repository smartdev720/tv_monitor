const express = require("express");
const {
  getAllByDeviceId,
  updateOne,
  removeOne,
} = require("../controllers/iptvSettingsController");
const router = express.Router();

router.get("/deviceId/:id", getAllByDeviceId);
router.patch("/update-one", updateOne);
router.delete("/delete-one/:id", removeOne);

module.exports = router;
