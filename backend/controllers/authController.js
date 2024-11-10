const queryAsync = require("../config/queryAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    const name = `${firstName} ${lastName}`;
    let sql = "SELECT * FROM users WHERE email = ? ;";
    const existUser = await queryAsync(sql, [email]);

    if (existUser && existUser.length > 0) {
      return res
        .status(200)
        .json({ ok: false, message: "User already exists" });
    }
    sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?) ;";
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await queryAsync(sql, [name, email, hashedPassword]);

    if (!result) {
      return res.status(500).json({ ok: false, message: "Server error" });
    }

    return res
      .status(200)
      .json({ ok: true, message: "Registered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? ;";
    const rows = await queryAsync(sql, [email]);
    const user = rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({ ok: true, token: `Bearer ${token}` });
    }
    return res.json({ ok: false, message: "Invalid credentials" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Error Logging in" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
