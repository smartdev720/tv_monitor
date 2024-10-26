const db = require("../config/db");
const queryAsync = require("../config/queryAsync");

exports.getAllDevices = async (req, res) => {
  try {
    const sql = "SELECT * FROM devices";
    db.query(sql, [], (err, results) => {
      if (err) {
        return res.status(400).json({ ok: false, message: "Server error" });
      }
      return res.status(200).json({ ok: true, data: results });
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { id, name, place, active } = req.body;
    const sql =
      "UPDATE devices SET name = ?, place = ?, active = ? WHERE id = ? ;";
    const result = await queryAsync(sql, [name, place, active, id]);
    if (!result) {
      return res.status(400).json({ ok: false, message: "Server error" });
    }
    return res.status(200).json({ ok: true, message: "Saved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
