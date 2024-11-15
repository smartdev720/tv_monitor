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
          name: t2.name,
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

exports.getOnlyT2SettingsByDeviceId = async (req, res) => {
  try {
    const { id } = req.params;
    const select_t2settings = "SELECT * FROM t2_settings WHERE device_id = ? ;";
    const settings = await queryAsync(select_t2settings, [id]);
    return res.status(200).json({ ok: true, data: settings });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getChartDataByIdAndDate = async (req, res) => {
  try {
    const { id, date } = req.body;
    const sql =
      "SELECT * FROM Dat_4 WHERE settings_id = ? AND DATE(time_dat) = ?;";
    const charts = await queryAsync(sql, [id, date]);
    return res.status(200).json({ ok: true, data: charts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getMultipleT2SettingsByLocationIds = async (req, res) => {
  try {
    const { locations, date } = req.body;
    let sql = "SELECT id FROM t2_settings WHERE device_id = ? AND active = 1;";
    const settings = await Promise.all(
      locations.map(async (location) => {
        const setting = await queryAsync(sql, [location.location_id]);
        return {
          locationId: location.location_id,
          settingId: setting.length > 0 ? setting[0].id : null,
        };
      })
    );
    sql =
      "SELECT id FROM group_composition WHERE setting_id = ? AND (command_id = 4 OR command_id = 5 OR command_id = 6);";
    const compares = await Promise.all(
      settings.map(async (setting) => {
        if (setting.settingId === null) return { groupId: null };
        const compas = await queryAsync(sql, [setting.settingId]);
        return {
          compareId: compas.length > 0 ? compas[0].id : null,
        };
      })
    );
    sql = "SELECT cnt FROM Dat_4 WHERE settings_id = ? AND DATE(time_dat) = ?;";
    const cnts = await Promise.all(
      settings.map(async (setting) => {
        if (setting.settingId === null) return { cnt: null };
        const result = await queryAsync(sql, [setting.settingId, date]);
        return {
          cnt: result.length > 0 ? result[0].cnt : null,
        };
      })
    );
    sql =
      "SELECT id FROM bad_data WHERE cnt = ? AND (command_id = 4 OR command_id = 5 OR command_id = 6) AND DATE(time) = ?;";
    const badData = await Promise.all(
      cnts.map(async (cnt) => {
        if (cnt.cnt === null) return { badDataId: null };
        const result = await queryAsync(sql, [cnt.cnt, date]);
        return {
          badDataId: result.length > 0 ? result[0].id : null,
        };
      })
    );
    const main = settings.map((setting, index) => ({
      locationId: setting.locationId,
      settingId: setting.settingId,
      badData: badData[index].badDataId,
    }));
    return res.status(200).json({ ok: true, data: { main, compares } });
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
