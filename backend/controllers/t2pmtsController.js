const queryAsync = require("../config/queryAsync");

exports.getT2pmtsBySettingId = async (req, res) => {
  try {
    const { id } = req.params;
    const select_t2pmts = "SELECT * FROM t2_pmts WHERE t2_setting_id = ? ;";
    const t2pmts = await queryAsync(select_t2pmts, [id]);
    return res.status(200).json({ ok: true, data: t2pmts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getT2PmtsBySettingIdBeforeDate = async (req, res) => {
  try {
    const { id, date } = req.body;
    const select_t2pmts =
      "SELECT * FROM t2_pmts WHERE t2_setting_id = ? AND time <= STR_TO_DATE(?, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND ORDER BY time DESC;";
    const t2pmts = await queryAsync(select_t2pmts, [id, date]);
    return res.status(200).json({ ok: true, data: t2pmts });
  } catch (err) {
    console.error("Error fetching data:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getT2VideoListByIdAndDate = async (req, res) => {
  try {
    const { id, date } = req.body;
    const sql = "SELECT * FROM Dat_6 WHERE pmts_id = ? AND DATE(time_dat) = ?;";
    const videos = await queryAsync(sql, [id, date]);
    return res.status(200).json({ ok: true, data: videos });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.updateUnderControlById = async (req, res) => {
  try {
    const { key, under_control } = req.body;
    const update_query = "UPDATE t2_pmts SET under_control = ? WHERE id = ? ;";
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
