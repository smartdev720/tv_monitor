const express = require("express");
const router = express.Router();
const {
  getAllGroups,
  getSelectedCommands,
  addNewOne,
  removeOne,
  updateCommandList,
} = require("../controllers/groupsController");

router.get("/all", getAllGroups);
router.post("/selected-commands", getSelectedCommands);
router.post("/add-new", addNewOne);
router.delete("/delete-one/:id", removeOne);
router.patch("/update-commandList", updateCommandList);

module.exports = router;
