const queryAsync = require("../config/queryAsync");

exports.getAllGroups = async (req, res) => {
  try {
    const select_groups = "SELECT * FROM groups_table;";
    const select_channels = "SELECT name FROM channels WHERE id = ?;";
    const groups = await queryAsync(select_groups, []);
    const data = await Promise.all(
      groups.map(async (group) => {
        const channels = await queryAsync(select_channels, [group.channel_id]);
        return {
          id: group.id,
          channel: channels.length > 0 ? channels[0].name : null,
          name: group.name,
        };
      })
    );
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getSelectedCommands = async (req, res) => {
  try {
    const { tvTable, device_id } = req.body;
    let select_settings = "";
    switch (tvTable) {
      case "iptv_settings":
        select_settings = `SELECT id, name as service_name FROM ${tvTable} WHERE device_id = ? ;`;
        const iptv = await queryAsync(select_settings, [device_id]);
        return res.status(200).json({ ok: true, data: iptv });
      case "analog_settings":
        select_settings = `SELECT id, program_name as service_name FROM ${tvTable} WHERE device_id = ? ;`;
        const analog = await queryAsync(select_settings, [device_id]);
        return res.status(200).json({ ok: true, data: analog });
      case "cable_settings":
        select_settings = `SELECT id FROM ${tvTable} WHERE device_id = ? ;`;
        const cable = await queryAsync(select_settings, [device_id]);
        select_settings =
          "SELECT id, service_name,	channel_id FROM cable_pmts WHERE cable_setting_id = ? ;";
        const cablePmts = await Promise.all(
          cable.map(async (ca) => {
            const cpts = await queryAsync(select_settings, [ca.id]);
            return {
              id: ca.id,
              service_name: cpts.length > 0 ? cpts[0].service_name : null,
              channel_id: cpts.length > 0 ? cpts[0].channel_id : null,
              cable_pmts_id: cpts.length > 0 ? cpts[0].id : null,
            };
          })
        );
        select_settings = "SELECT logo FROM channels WHERE id = ? ;";
        const cableData = await Promise.all(
          cablePmts.map(async (cp) => {
            const channels = await queryAsync(select_settings, [cp.channel_id]);
            return {
              id: cp.id,
              service_name: cp.service_name,
              channel_id: cp.channel_id,
              cable_pmts_id: cp.cable_pmts_id,
              logo: channels.length > 0 ? channels[0].logo : null,
            };
          })
        );
        return res.status(200).json({ ok: true, data: cableData });
      case "t2_settings":
        select_settings = `SELECT id FROM ${tvTable} WHERE device_id = ? ;`;
        const t2Settings = await queryAsync(select_settings, [device_id]);
        select_settings =
          "SELECT id, service_name, channel_id FROM t2_pmts WHERE t2_setting_id = ? ;";
        const t2Pmts = await Promise.all(
          t2Settings.map(async (t2setting) => {
            const pmts = await queryAsync(select_settings, [t2setting.id]);
            return {
              id: t2setting.id,
              t2_pmts_id: pmts.length > 0 ? pmts[0].id : null,
              service_name: pmts.length > 0 ? pmts[0].service_name : null,
              channel_id: pmts.length > 0 ? pmts[0].channel_id : null,
            };
          })
        );
        select_settings = "SELECT logo FROM channels WHERE id = ? ;";
        const t2Data = await Promise.all(
          t2Pmts.map(async (t2pmt) => {
            const channels = await queryAsync(select_settings, [
              t2pmt.channel_id,
            ]);
            return {
              id: t2pmt.id,
              t2_pmts_id: t2pmt.t2_pmts_id,
              service_name: t2pmt.service_name,
              channel_id: t2pmt.channel_id,
              logo: channels.length > 0 ? channels[0].logo : null,
            };
          })
        );
        return res.status(200).json({ ok: true, data: t2Data });
      default:
        return;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
