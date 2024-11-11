const queryAsync = require("../config/queryAsync");

exports.getCableSettingsByDeviceId = async (req, res) => {
  try {
    const { id } = req.params;
    const select_cableSettings =
      "SELECT * FROM cable_settings WHERE device_id = ? ;";
    const select_pwr =
      "SELECT cnt, pwr FROM Dat_1 LAST WHERE device_id = ? AND data_cmd = ? ;";
    const cableSettings = await queryAsync(select_cableSettings, [id]);
    const data = await Promise.all(
      cableSettings.map(async (cable) => {
        const pwrs = await queryAsync(select_pwr, [id, cable.frequency]);
        return {
          id: cable.id,
          device_id: cable.device_id,
          modulation_type: cable.modulation_type,
          frequency: cable.frequency,
          symbol_rate: cable.symbol_rate,
          plp: cable.plp,
          name: cable.name,
          active: cable.active,
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

exports.getOnlySettingsByDeviceId = async (req, res) => {
  try {
    const { id } = req.params;
    const select_cableSettings =
      "SELECT * FROM cable_settings WHERE device_id = ? ;";
    const settings = await queryAsync(select_cableSettings, [id]);
    return res.status(200).json({ ok: true, data: settings });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.updateCableSetting = async (req, res) => {
  try {
    const {
      key,
      active,
      frequency,
      modulation_type,
      symbol_rate,
      device_id,
      pwr,
    } = req.body;
    const update_query =
      "UPDATE cable_settings SET active = ?, frequency = ?, modulation_type = ?, symbol_rate = ? WHERE id = ? ;";
    const result = await queryAsync(update_query, [
      active,
      frequency,
      modulation_type,
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
    const delete_one = "DELETE FROM cable_settings WHERE id = ? ;";
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
