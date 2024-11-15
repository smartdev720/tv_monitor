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

exports.getMultipleIPTVSettingsByLocationIds = async (req, res) => {
  try {
    const { locations, date } = req.body;
    let sql =
      "SELECT id FROM iptv_settings WHERE device_id = ? AND active = 1;";
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
      "SELECT id FROM group_composition WHERE setting_id = ? AND command_id = 7;";
    const compares = await Promise.all(
      settings.map(async (setting) => {
        if (setting.settingId === null) return { groupId: null };
        const compas = await queryAsync(sql, [setting.settingId]);
        return {
          compareId: compas.length > 0 ? compas[0].id : null,
        };
      })
    );

    sql = "SELECT cnt FROM Dat_7 WHERE settings_id = ? AND DATE(time_dat) = ?;";
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
      "SELECT id FROM bad_data WHERE cnt = ? AND command_id = 7 AND DATE(time) = ?;";
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
