const queryAsync = require("../config/queryAsync");

exports.getAnalogSettingsByDeviceId = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM analog_settings WHERE device_id = ?;";
    const select_dat8 =
      "SELECT pwr FROM Dat_8 WHERE device_id = ? AND data_cmd = ? AND time_cmd >= NOW() - INTERVAL 1 HOUR ORDER BY time_cmd DESC LIMIT 1;";
    const analogSettings = await queryAsync(sql, [id]);
    const dat8Results = await Promise.all(
      analogSettings.map(async (as) => {
        const pwrResult = await queryAsync(select_dat8, [id, as.frerquency]);
        return {
          ...as,
          pwr: pwrResult.length > 0 ? pwrResult[0].pwr : null,
        };
      })
    );
    return res.status(200).json({ ok: true, data: dat8Results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getOnlyAnalogSettingsByDeviceId = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM analog_settings WHERE device_id = ?;";
    const settings = await queryAsync(sql, [id]);
    return res.status(200).json({ ok: true, data: settings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getChartDataByIdAndDate = async (req, res) => {
  try {
    const { id, date } = req.body;
    const sql =
      "SELECT * FROM Dat_8 WHERE settings_id = ? AND DATE(time_dat) = ?;";
    const charts = await queryAsync(sql, [id, date]);
    return res.status(200).json({ ok: true, data: charts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getMultipleAnalogSettingsByLocationIds = async (req, res) => {
  try {
    const { locations, date } = req.body;
    let sql =
      "SELECT id FROM analog_settings WHERE device_id = ? AND active = 1;";
    const settings = await Promise.all(
      locations.map(async (location) => {
        const setting = await queryAsync(sql, [location.location_id]);
        return {
          locationId: location.location_id,
          settingId: setting.length > 0 ? setting[0].id : null,
        };
      })
    );

    sql = "SELECT cnt FROM Dat_8 WHERE settings_id = ? AND DATE(time_dat) = ?;";
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
      "SELECT id FROM bad_data WHERE cnt = ? AND (command_id = 8 OR command_id = 9 OR command_id = 10) AND DATE(time) = ?;";
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
    return res.status(200).json({ ok: true, data: { main } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { key, active, frequency, program_name, standart } = req.body;
    const sql =
      "UPDATE analog_settings SET active = ?, frerquency = ?, program_name = ?, standart = ? WHERE id = ? ;";
    const result = await queryAsync(sql, [
      active,
      frequency,
      program_name,
      standart,
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

exports.getVideoListBySettingId = async (req, res) => {
  try {
    const { id, date } = req.body;
    const sql =
      "SELECT * FROM Dat_9 WHERE settings_id = ? AND DATE(time_dat) = ?;";
    const videos = await queryAsync(sql, [id, date]);
    return res.status(200).json({ ok: true, data: videos });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
