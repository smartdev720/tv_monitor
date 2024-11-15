const queryAsync = require("../config/queryAsync");

exports.getNewMessagesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const sql =
      "SELECT id, web_demo_time, message FROM messages WHERE user_id = ? AND web_confirmation IS NULL;";
    const result = await queryAsync(sql, [userId]);
    if (!result) {
      return res.status(404).json({ ok: false, message: "Message not found" });
    }
    return res.status(200).json({ ok: true, data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.updateCheckedMessageById = async (req, res) => {
  try {
    const { id, date } = req.body;
    const sql = "UPDATE messages SET web_confirmation = ? WHERE id = ? ;";
    const result = await queryAsync(sql, [date, id]);
    if (!result) {
      return res.status(400).json({ ok: false, message: "Bad request" });
    }
    return res.status(200).json({ ok: true, message: "Saved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
