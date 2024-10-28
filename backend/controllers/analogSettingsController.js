const queryAsync = require("../config/queryAsync");

exports.getAnalogSettingsByDeviceId = async (req, res) => {
  try {
    const { id } = req.params;
    const select_analog_settings =
      "SELECT * FROM analog_settings WHERE device_id = ?;";
    const select_dat8 =
      "SELECT pwr FROM Dat_8 WHERE device_id = ? AND data_cmd = ? AND time_cmd >= NOW() - INTERVAL 1 HOUR ORDER BY time_cmd DESC LIMIT 1;";
    const analogSettings = await queryAsync(select_analog_settings, [id]);
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

exports.updateOne = async (req, res) => {
  try {
    const { key, active, frequency, program_name, standart } = req.body;
    const update_query =
      "UPDATE analog_settings SET active = ?, frerquency = ?, program_name = ?, standart = ? WHERE id = ? ;";
    const result = await queryAsync(update_query, [
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
