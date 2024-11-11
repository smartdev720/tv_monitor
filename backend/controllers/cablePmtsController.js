const queryAsync = require("../config/queryAsync");

exports.getCablepmtsBySettingId = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM cable_pmts WHERE cable_setting_id = ? ;";
    const pmts = await queryAsync(sql, [id]);
    return res.status(200).json({ ok: true, data: pmts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getCablepmtsBySettingIdBeforeDate = async (req, res) => {
  try {
    const { id, date } = req.body;
    const sql =
      "SELECT * FROM cable_pmts WHERE cable_setting_id = ? AND time <= STR_TO_DATE(?, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND ORDER BY time DESC;";
    const pmts = await queryAsync(sql, [id, date]);
    return res.status(200).json({ ok: true, data: pmts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.updateUnderControlById = async (req, res) => {
  try {
    const { key, under_control } = req.body;
    const update_query =
      "UPDATE cable_pmts SET under_control = ? WHERE id = ? ;";
    const result = await queryAsync(update_query, [under_control, key]);
    if (!result) {
      return res.status(400).json({ ok: false, message: "Server error" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
