const express = require("express");
const {
  getNewMessagesByUserId,
  updateCheckedMessageById,
} = require("../controllers/messageController");
const router = express.Router();

router.get("/get/:userId", getNewMessagesByUserId);
router.patch("/checked", updateCheckedMessageById);

module.exports = router;
