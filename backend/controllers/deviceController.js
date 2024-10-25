const db = require("../config/db");

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
