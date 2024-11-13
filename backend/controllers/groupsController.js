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
        let totalData = { pmts: [], channels: [] };
        select_settings = `SELECT id FROM ${tvTable} WHERE device_id = ? ;`;
        const cables = await queryAsync(select_settings, [device_id]);
        const select_cable_pmts =
          "SELECT id, service_name,	channel_id FROM cable_pmts WHERE cable_setting_id = ? ;";
        const cablePmts = await Promise.all(
          cables.map(async (cable) => {
            const pmts = await queryAsync(select_cable_pmts, [cable.id]);
            return pmts.map((pmt) => ({
              ...pmt,
              cable_setting_id: cable.id,
            }));
          })
        );
        totalData.pmts = cablePmts.flat();
        const select_channels = "SELECT logo FROM channels WHERE id = ? ;";
        const channelResults = await Promise.all(
          totalData.pmts.map(async (pmt) => {
            const channels = await queryAsync(select_channels, [
              pmt.channel_id,
            ]);
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
            cable_pmts_id: pmt.id,
            service_name: pmt.service_name,
            channel_id: pmt.channel_id,
            logo: channel ? channel.logo : null,
          };
        });
        return res.status(200).json({ ok: true, data: formattedData });
      case "t2_settings":
        let total = { pmts: [], channels: [] };
        select_settings = `SELECT id FROM ${tvTable} WHERE device_id = ? ;`;
        const t2Settings = await queryAsync(select_settings, [device_id]);
        const select_t2_pmts =
          "SELECT id, service_name, channel_id FROM t2_pmts WHERE t2_setting_id = ? ;";
        const t2Pmts = await Promise.all(
          t2Settings.map(async (t2Setting) => {
            const pmts = await queryAsync(select_t2_pmts, [t2Setting.id]);
            return pmts.map((pmt) => ({
              ...pmt,
              t2_setting_id: pmt.id,
            }));
          })
        );
        total.pmts = t2Pmts.flat();
        const select_channel = "SELECT logo FROM channels WHERE id = ? ;";
        const chanResults = await Promise.all(
          total.pmts.map(async (pmt) => {
            const chans = await queryAsync(select_channel, [pmt.channel_id]);
            return { pmt, chans };
          })
        );
        total.channels = chanResults.reduce(
          (acc, result) => acc.concat(result.chans),
          []
        );
        const formattedT2Data = total.pmts.map((pmt) => {
          const channel = total.channels.find(
            (channel) => channel.id === pmt.channel_id
          );
          return {
            id: pmt.id,
            t2_pmts_id: pmt.id,
            service_name: pmt.service_name,
            channel_id: pmt.channel_id,
            logo: channel ? channel.logo : null,
          };
        });
        return res.status(200).json({ ok: true, data: formattedT2Data });
      default:
        return;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getDat99ByGroupIdAndDate = async (req, res) => {
  try {
    const { id, date } = req.body;
    const sql =
      "SELECT * FROM Dat_99 WHERE group_id = ? AND DATE(time_dat) = ?;";
    const dat99 = await queryAsync(sql, [id, date]);
    if (typeof dat99 === "object") {
      return res.status(200).json({ ok: true, data: [...dat99] });
    }
    return res.status(200).json({ ok: true, data: dat99 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getDat99ResByCnt = async (req, res) => {
  try {
    const { cnt } = req.params;
    const sql = "SELECT * FROM Dat_99_res WHERE cnt = ?;";
    const dat99Res = await queryAsync(sql, [cnt]);
    return res.status(200).json({ ok: true, data: dat99Res });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.addNewOne = async (req, res) => {
  try {
    const { name, channel_id, model_id } = req.body;
    const insert_new_group =
      "INSERT INTO groups_table (name, channel_id, model_id, command_list) VALUES (?, ?, ?, ?) ;";
    const nw = await queryAsync(insert_new_group, [
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

exports.removeOne = async (req, res) => {
  try {
    const { id } = req.params;
    const delete_one = "DELETE FROM groups_table WHERE id = ? ;";
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

exports.updateCommandList = async (req, res) => {
  try {
    const { id, command_list } = req.body;
    console.log(id);
    const update_command_list =
      "UPDATE groups_table SET command_list = ? WHERE id = ? ;";
    const result = await queryAsync(update_command_list, [command_list, id]);
    if (!result) {
      return res.status(400).json({ ok: false, message: "Server error" });
    }
    return res.status(200).json({ ok: true, message: "Saved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
