const express = require("express");
const {
  updateMain,
  updateExtGroup,
} = require("../controllers/extValController");
const router = express.Router();

router.patch("/update", updateMain);
router.patch("/update/group", updateExtGroup);

module.exports = router;
