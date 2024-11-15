const queryAsync = require("../config/queryAsync");

exports.getCompareBadData = async (req, res) => {
  try {
    const { date } = req.body;
    let sql =
      "SELECT cnt FROM bad_data WHERE command_id = 99 AND DATE(time) = ?;";
    const result = await queryAsync(sql, [date]);
    return res.status(200).json({ ok: true, data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
