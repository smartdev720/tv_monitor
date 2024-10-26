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
          model_id: group.model_id,
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
              id: cpts.length > 0 ? cpts[0].id : null,
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
              id: pmts.length > 0 ? pmts[0].id : null,
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

exports.addNewOne = async (req, res) => {
  try {
    const { name, channel_id, model_id } = req.body;
    const allGroups = await queryAsync("SELECT * FROM groups_table", []);
    const insert_new_group =
      "INSERT INTO groups_table (id, name, channel_id, model_id, comand_list) VALUES (?, ?, ?, ?, ?) ;";
    const nw = await queryAsync(insert_new_group, [
      allGroups.length + 1,
      name,
      channel_id,
      model_id,
      "",
    ]);
    const select_new_group =
      "SELECT * FROM groups_table WHERE name = ? AND channel_id = ? AND model_id = ? ORDER BY id DESC LIMIT 1;";
    const newGroup = await queryAsync(select_new_group, [
      name,
      channel_id,
      model_id,
    ]);
    const select_channels = "SELECT name FROM channels WHERE id = ?;";
    const channel = await queryAsync(select_channels, [channel_id]);
    const data = {
      id: newGroup[0].id,
      channel: channel[0].name,
      name: newGroup[0].name,
      model_id: newGroup[0].model_id,
    };
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
