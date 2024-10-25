const express = require("express");
const router = express.Router();
const {
  getAllGroups,
  getSelectedCommands,
} = require("../controllers/groupsController");

router.get("/all", getAllGroups);
router.post("/selected-commands", getSelectedCommands);

module.exports = router;
