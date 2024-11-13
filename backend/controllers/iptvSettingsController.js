const queryAsync = require("../config/queryAsync");

exports.getAllByDeviceId = async (req, res) => {
  try {
    const { id } = req.params;
    const select_iptv_settings =
      "SELECT * FROM iptv_settings WHERE device_id = ? ;";
    const iptvSettings = await queryAsync(select_iptv_settings, [id]);
    return res.status(200).json({ ok: true, data: iptvSettings });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getVideoListByIdAndDate = async (req, res) => {
  try {
    const { id, date } = req.body;
    const sql =
      "SELECT * FROM Dat_7 WHERE settings_id = ? AND DATE(time_dat) = ?;";
    const videos = await queryAsync(sql, [id, date]);
    return res.status(200).json({ ok: true, data: videos });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { key, name, url, active } = req.body;
    const select_iptv_settings =
      "UPDATE iptv_settings SET name = ?, url = ?, active = ? WHERE id = ? ;";
    const result = await queryAsync(select_iptv_settings, [
      name,
      url,
      active,
      key,
    ]);
    if (!result) {
      return res.status(400).json({ ok: false, message: "Server error" });
    }
    return res.status(200).json({ ok: true, message: "Saved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.removeOne = async (req, res) => {
  try {
    const { id } = req.params;
    const delete_one = "DELETE FROM iptv_settings WHERE id = ? ;";
    const result = await queryAsync(delete_one, [id]);
    if (!result) {
      return res.status(400).json({ ok: false, message: "Server error" });
    }
    return res.status(200).json({ ok: true, message: "Removed successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
