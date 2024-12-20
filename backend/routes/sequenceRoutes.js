const express = require("express");
const router = express.Router();
const {
  getSequence6,
  getSequence4,
  getSequence1,
  getSequence3,
  getSequence7,
  getSequence10,
  insertOne,
  updateOne,
} = require("../controllers/sequenceController");

router.get("/command6/:id", getSequence6);
router.get("/command4/:id", getSequence4);
router.get("/command1/:id", getSequence1);
router.get("/command3/:id", getSequence3);
router.get("/command7/:id", getSequence7);
router.get("/command10/:id", getSequence10);
router.post("/insert-one", insertOne);
router.patch("/update-one", updateOne);
module.exports = router;
