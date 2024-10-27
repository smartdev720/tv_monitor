const queryAsync = require("../config/queryAsync");

exports.getT2SettingsByDeviceId = async (req, res) => {
  try {
    const { id } = req.params;
    const select_t2settings = "SELECT * FROM t2_settings WHERE device_id = ? ;";
    const select_pwr =
      "SELECT cnt, pwr FROM Dat_4 LAST WHERE device_id = ? AND data_cmd = ? ;";
    const t2Settings = await queryAsync(select_t2settings, [id]);
    const data = await Promise.all(
      t2Settings.map(async (t2) => {
        const pwrs = await queryAsync(select_pwr, [id, t2.frequency]);
        return {
          id: t2.id,
          device_id: t2.device_id,
          modulation_type: t2.modulation_type,
          frequency: t2.frequency,
          symbol_rate: t2.symbol_rate,
          plp: t2.plp,
          active: t2.active,
          pwr: pwrs.length > 0 ? pwrs[0].pwr : null,
          dat4_cnt: pwrs.length > 0 ? pwrs[0].id : null,
        };
      })
    );
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.updateT2Setting = async (req, res) => {
  try {
    const {
      key,
      active,
      frequency,
      modulation_type,
      plp,
      symbol_rate,
      device_id,
      pwr,
    } = req.body;
    const update_query =
      "UPDATE t2_settings SET active = ?, frequency = ?, modulation_type = ?, plp = ?, symbol_rate = ? WHERE id = ? ;";
    const result = await queryAsync(update_query, [
      active,
      frequency,
      modulation_type,
      plp,
      symbol_rate,
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
    const delete_one = "DELETE FROM t2_settings WHERE id = ? ;";
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
