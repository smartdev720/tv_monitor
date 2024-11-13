const express = require("express");
const { updateOne } = require("../controllers/deviceController");
const router = express.Router();

router.patch("/update-one", updateOne);

module.exports = router;
