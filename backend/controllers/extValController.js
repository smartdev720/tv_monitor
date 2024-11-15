const queryAsync = require("../config/queryAsync");

exports.updateMain = async (req, res) => {
  try {
    const {
      pwrMin,
      pwrMax,
      snrMax,
      snrMin,
      berMax,
      berMin,
      settingsId,
      active,
      commandId,
      userId,
    } = req.body;
    let sql = "";
    let result;
    if (settingsId) {
      sql =
        "UPDATE extreme_val SET pwr_min = ?, pwr_max = ?, snr_min = ?, snr_max = ?, ber_min = ?, ber_max = ?, active = ? WHERE user_id = ? AND settings_id = ? AND command_id = ?;";
      result = await queryAsync(sql, [
        pwrMin,
        pwrMax,
        snrMin,
        snrMax,
        berMin,
        berMax,
        active,
        userId,
        settingsId,
        commandId,
      ]);
    } else {
      sql =
        "UPDATE extreme_val SET pwr_min = ?, pwr_max = ?, snr_min = ?, snr_max = ?, ber_min = ?, ber_max = ?, active = ? WHERE user_id = ? AND settings_id = 0 AND command_id = ?;";
      result = await queryAsync(sql, [
        pwrMin,
        pwrMax,
        snrMin,
        snrMax,
        berMin,
        berMax,
        active,
        userId,
        commandId,
      ]);
    }
    if (!result) {
      return res.status(400).json({ ok: false, message: "Bad request" });
    }
    return res.status(200).json({ ok: true, message: "Saved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.updateExtGroup = async (req, res) => {
  try {
    const { settingId, userId, delayMin, delayMax } = req.body;
    let sql = "";
    let result;
    if (settingId) {
      sql =
        "UPDATE extreme_val SET delay_min = ?, delay_max = ? WHERE user_id = ? AND settings_id = ? AND command_id = 99 AND name = 'delay' ;";
      result = await queryAsync(sql, [delayMin, delayMax, userId, settingId]);
    } else {
      sql =
        "UPDATE extreme_val SET delay_min = ?, delay_max = ? WHERE user_id = ? AND settings_id = 0 AND command_id = 99 AND name = 'delay' ;";
      result = await queryAsync(sql, [delayMin, delayMax, userId]);
    }
    if (!result) {
      return res.status(400).json({ ok: false, message: "Bad request" });
    }
    return res.status(200).json({ ok: true, message: "Saved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
