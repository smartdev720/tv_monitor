const queryAsync = require("../config/queryAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userRegister = async (req, res) => {
  try {
    const {
      email,
      name,
      name2,
      surname,
      phone,
      telegram,
      viber,
      password,
      locationId,
    } = req.body;
    let sql = "SELECT * FROM users WHERE email = ? ;";
    const existUser = await queryAsync(sql, [email]);

    if (existUser && existUser.length > 0) {
      return res
        .status(200)
        .json({ ok: false, message: "User already exists" });
    }
    sql =
      "INSERT INTO users (name, email, password, name2, surname, phone, telegram, viber) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ;";
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await queryAsync(sql, [
      name,
      email,
      hashedPassword,
      name2,
      surname,
      phone,
      telegram,
      viber,
    ]);

    if (!result) {
      return res.status(500).json({ ok: false, message: "Server error" });
    }

    sql = "SELECT id FROM users WHERE email = ? ;";
    const user = await queryAsync(sql, [email]);
    console.log(user);
    sql =
      "INSERT INTO locations_for_users (user_id, location_id) VALUES (?, ?) ;";
    const tResult = await queryAsync(sql, [user[0].id, locationId]);
    if (!tResult) {
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
