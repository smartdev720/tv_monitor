const queryAsync = require("../config/queryAsync");

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    let sql = "SELECT * FROM users WHERE id = ? ;";
    const user = await queryAsync(sql, [id]);
    if (user && user.length === 0) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    sql = "SELECT location_id FROM locations_for_users WHERE user_id = ?";
    const result = await queryAsync(sql, [user[0].id]);
    const data = {
      ...user[0],
      locations: result,
    };
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
