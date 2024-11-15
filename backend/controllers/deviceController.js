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

exports.getDevicesById = async (req, res) => {
  try {
    const { locations } = req.body;
    const sql = "SELECT * FROM devices WHERE id = ? ;";
    const devices = await Promise.all(
      locations.map(async (location) => {
        const device = await queryAsync(sql, [location.location_id]);
        return device[0];
      })
    );
    return res.status(200).json({ ok: true, data: devices });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { id, place, active } = req.body;
    const sql = "UPDATE devices SET place = ?, active = ? WHERE id = ? ;";
    const result = await queryAsync(sql, [place, active, id]);
    if (!result) {
      return res.status(400).json({ ok: false, message: "Server error" });
    }
    return res.status(200).json({ ok: true, message: "Saved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
