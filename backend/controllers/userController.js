const queryAsync = require("../config/queryAsync");

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM users WHERE id = ? ;";
    const user = await queryAsync(sql, [id]);
    if (user && user.length === 0) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    return res.status(200).json({ ok: true, data: user[0] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
