const express = require("express");
const { getUserById } = require("../controllers/userController");
const router = express.Router();

router.get("/:id", getUserById);

module.exports = router;
