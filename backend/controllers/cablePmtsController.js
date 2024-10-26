const queryAsync = require("../config/queryAsync");

exports.getCablepmtsBySettingId = async (req, res) => {
  try {
    const { id } = req.params;
    const select_t2pmts =
      "SELECT * FROM cable_pmts WHERE cable_setting_id = ? ;";
    const t2pmts = await queryAsync(select_t2pmts, [id]);
    return res.status(200).json({ ok: true, data: t2pmts });
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
