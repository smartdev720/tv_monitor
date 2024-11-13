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
