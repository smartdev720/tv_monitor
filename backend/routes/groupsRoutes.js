const express = require("express");
const router = express.Router();
const {
  getAllGroups,
  getSelectedCommands,
  getDat99ByGroupIdAndDate,
  getDat99ResByCnt,
  addNewOne,
  removeOne,
  updateCommandList,
  getGroupByBadDataCnt,
} = require("../controllers/groupsController");

router.get("/all", getAllGroups);
router.get("/get/bad-data/:cnt", getGroupByBadDataCnt);
router.post("/selected-commands", getSelectedCommands);
router.post("/get/dat99", getDat99ByGroupIdAndDate);
router.get("/get/dat99-res/:cnt", getDat99ResByCnt);
router.post("/add-new", addNewOne);
router.delete("/delete-one/:id", removeOne);
router.patch("/update-commandList", updateCommandList);
router.patch("/update/ext");

module.exports = router;
