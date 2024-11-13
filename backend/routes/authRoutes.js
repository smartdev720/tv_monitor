const express = require("express");
const { userRegister, login } = require("../controllers/authController");
const router = express.Router();

router.post("/user-register", userRegister);
router.post("/user-login", login);

module.exports = router;
