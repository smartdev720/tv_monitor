const express = require("express");
const {
  getAll,
  insertOne,
  updateOne,
} = require("../controllers/scheduleController");
const router = express.Router();

router.get("/all", getAll);
router.post("/insert-one", insertOne);
router.patch("/update-one", updateOne);

module.exports = router;
