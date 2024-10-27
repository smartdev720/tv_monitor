const express = require("express");
const router = express.Router();
const {
  getAllGroups,
  getSelectedCommands,
  addNewOne,
  removeOne,
} = require("../controllers/groupsController");

router.get("/all", getAllGroups);
router.post("/selected-commands", getSelectedCommands);
router.post("/add-new", addNewOne);
router.delete("/delete-one/:id", removeOne);

module.exports = router;
