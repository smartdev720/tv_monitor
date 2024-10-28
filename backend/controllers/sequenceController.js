const queryAsync = require("../config/queryAsync");

exports.getSequence6 = async (req, res) => {
  try {
    const { id } = req.params;

    const select_t2_settings_query =
      "SELECT * FROM t2_settings WHERE device_id = ? AND active = 1;";
    const select_t2_service =
      "SELECT id, service_name, channel_id FROM t2_pmts WHERE t2_setting_id = ? AND under_control = 1;";
    const select_channel = "SELECT * FROM channels WHERE id = ?";
    const settings = await queryAsync(select_t2_settings_query, [id]);
    let totalData = { pmts: [], channels: [] };

    const pmtResults = await Promise.all(
      settings.map(async (setting) => {
        const pmts = await queryAsync(select_t2_service, [setting.id]);
        return pmts.map((pmt) => ({
          ...pmt,
          frequency: setting.frequency,
        }));
      })
    );

    totalData.pmts = pmtResults.flat();

    const channelResults = await Promise.all(
      totalData.pmts.map(async (pmt) => {
        const channels = await queryAsync(select_channel, [pmt.channel_id]);
        return { pmt, channels };
      })
    );

    totalData.channels = channelResults.reduce(
      (acc, result) => acc.concat(result.channels),
      []
    );
    const formattedData = totalData.pmts.map((pmt) => {
      const channel = totalData.channels.find(
        (channel) => channel.id === pmt.channel_id
      );
      return {
        id: pmt.id,
        service_name: pmt.service_name,
        frequency: pmt.frequency,
        logo: channel ? channel.logo : null,
      };
    });
    return res.status(200).json({ ok: true, data: formattedData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getSequence4 = async (req, res) => {
  try {
    const { id } = req.params;
    const select_t2settings = "SELECT * FROM t2_settings WHERE device_id = ?";
    const sql_t2pmt =
      "SELECT id, service_name FROM t2_pmts WHERE t2_setting_id = ? ;";
    const t2Frequency = await queryAsync(select_t2settings, [id]);
    const data = await Promise.all(
      t2Frequency.map(async (t2) => {
        const pmt = await queryAsync(sql_t2pmt, [t2.id]);
        return {
          id: pmt.length > 0 ? pmt[0].id : null,
          t2_setting_id: t2.id,
          service_name: pmt.length > 0 ? pmt[0].service_name : null,
          frequency: t2.frequency,
        };
      })
    );
    return res.status(200).json({ ok: true, data });
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
    const sql_cablepmt =
      "SELECT id, service_name FROM cable_pmts WHERE cable_setting_id = ? ;";

    const cableFrequency = await queryAsync(select_cableSettings, [id]);
    const totalData = await Promise.all(
      cableFrequency.map(async (cableSetting) => {
        const pmts = await queryAsync(sql_cablepmt, [cableSetting.id]);
        return {
          id: pmts.length > 0 ? pmts[0].id : null,
          frequency: cableSetting.frequency,
          service_name: pmts.length > 0 ? pmts[0].service_name : null,
        };
      })
    );
    return res.status(200).json({ ok: true, data: totalData });
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

    const settings = await queryAsync(select_cableSettings, [id]);
    let totalData = { pmts: [], channels: [] };

    const pmtResults = await Promise.all(
      settings.map(async (setting) => {
        const pmts = await queryAsync(select_cable_pmts, [setting.id]);
        return pmts.map((pmt) => ({
          ...pmt,
          frequency: setting.frequency,
        }));
      })
    );

    totalData.pmts = pmtResults.flat();

    const channelResults = await Promise.all(
      totalData.pmts.map(async (pmt) => {
        const channels = await queryAsync(select_channel, [pmt.channel_id]);
        return { pmt, channels };
      })
    );

    totalData.channels = channelResults.reduce(
      (acc, result) => acc.concat(result.channels),
      []
    );
    const formattedData = totalData.pmts.map((pmt) => {
      const channel = totalData.channels.find(
        (channel) => channel.id === pmt.channel_id
      );
      return {
        id: pmt.id,
        service_name: pmt.service_name,
        frequency: pmt.frequency,
        logo: channel ? channel.logo : null,
      };
    });
    return res.status(200).json({ ok: true, data: formattedData });
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
      "SELECT id, program_name, frerquency FROM analog_settings WHERE device_id = ? ;";
    const analogSettings = await queryAsync(select_analog_settings, [id]);
    return res.status(200).json({ ok: true, data: analogSettings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.insertOne = async (req, res) => {
  try {
    const { command_list } = req.body;
    let recommand = "";
    command_list.forEach((com) => {
      recommand += " " + com;
    });
    const select = "SELECT * FROM sequences ;";
    const se = await queryAsync(select, []);
    const sql = "INSERT INTO sequences (command_list, id) VALUES (?, ?) ;";
    const result = await queryAsync(sql, [recommand, se.length]);
    if (result) {
      return res.status(200).json({ ok: true, message: "Saved successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
