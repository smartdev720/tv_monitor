const queryAsync = require("../config/queryAsync");

exports.getSequence6 = async (req, res) => {
  try {
    const { id } = req.params;

    const select_t2_settings_query =
      "SELECT * FROM t2_settings WHERE device_id = ? AND active = 1;";
    const select_t2_service =
      "SELECT id, service_name, channel_id FROM t2_pmts WHERE t2_setting_id = ? AND under_control = 1;";
    const select_channel = "SELECT * FROM channels WHERE id = ?";

    const t2settings = await queryAsync(select_t2_settings_query, [id]);

    const totalData = { services: [], channels: [] };

    for (const t2setting of t2settings) {
      const t2services = await queryAsync(select_t2_service, [t2setting.id]);

      for (const service of t2services) {
        totalData.services.push(service);

        const channels = await queryAsync(select_channel, [service.channel_id]);
        totalData.channels.push(...channels);
      }
    }
    return res.status(200).json({ ok: true, data: totalData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getSequence4 = async (req, res) => {
  try {
    const { id } = req.params;
    const select_t2settings =
      "SELECT id, frequency FROM t2_settings WHERE device_id = ?";
    const t2Frequency = await queryAsync(select_t2settings, [id]);
    return res.status(200).json({ ok: true, data: t2Frequency });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getSequence1 = async (req, res) => {
  try {
    const { id } = req.params;
    const select_cableSettings =
      "SELECT id, frequency FROM cable_settings WHERE device_id = ?";
    const cableFrequency = await queryAsync(select_cableSettings, [id]);
    return res.status(200).json({ ok: true, data: cableFrequency });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getSequence3 = async (req, res) => {
  try {
    const { id } = req.params;
    const select_cableSettings =
      "SELECT * FROM cable_settings WHERE device_id = ? AND active = 1 ;";
    const select_cable_pmts =
      "SELECT id, service_name, channel_id FROM cable_pmts WHERE cable_setting_id = ? AND under_control = 1 ;";
    const select_channel = "SELECT * FROM channels WHERE id = ?";
    const cableSettings = await queryAsync(select_cableSettings, [id]);
    const totalData = { services: [], channels: [] };
    for (const cableSetting of cableSettings) {
      const cablePmts = await queryAsync(select_cable_pmts, [cableSetting.id]);
      for (const service of cablePmts) {
        totalData.services.push(service);
        const channels = await queryAsync(select_channel, [service.channel_id]);
        totalData.channels.push(...channels);
      }
    }
    return res.status(200).json({ ok: true, data: totalData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getSequence7 = async (req, res) => {
  try {
    const { id } = req.params;
    const select_iptv_settings =
      "SELECT id, name FROM iptv_settings WHERE device_id = ? ;";
    const iptvSettings = await queryAsync(select_iptv_settings, [id]);
    return res.status(200).json({ ok: true, data: iptvSettings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getSequence10 = async (req, res) => {
  try {
    const { id } = req.params;
    const select_analog_settings =
      "SELECT id, program_name FROM analog_settings WHERE device_id = ? ;";
    const analogSettings = await queryAsync(select_analog_settings, [id]);
    return res.status(200).json({ ok: true, data: analogSettings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
