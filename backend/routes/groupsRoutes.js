const express = require("express");
const router = express.Router();
const {
  getAllGroups,
  getSelectedCommands,
  addNewOne,
} = require("../controllers/groupsController");

router.get("/all", getAllGroups);
router.post("/selected-commands", getSelectedCommands);
router.post("/add-new", addNewOne);

module.exports = router;
