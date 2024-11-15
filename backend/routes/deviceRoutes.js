const express = require("express");
const {
  getDevicesById,
  updateOne,
} = require("../controllers/deviceController");
const router = express.Router();

router.post("/get-by-id", getDevicesById);
router.patch("/update-one", updateOne);

module.exports = router;
